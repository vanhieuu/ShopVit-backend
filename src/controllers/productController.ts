import { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body as Partial<IProduct>;
    const product = await Product.create(body);
    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
export const getProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find().sort("-createdAt");
    // Đảm bảo category luôn có giá trị
    const list = products.map((p) => ({
      _id: p._id,
      name: p.name,
      qrCode: p.qrCode,
      costPrice: p.costPrice,
      salePrice: p.salePrice,
      stockQty: p.stockQty,
      category: p.category || "Khác",
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      imageUrl: p.imageUrl,
      unit: p.unit,
      __v: p.__v,
    }));
    res.status(200).json({
      status: "success",
      data: { list },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
export const getProductsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = req.params.category as string;
    const list = await Product.find({ category }).sort("-createdAt");
    res.status(200).json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const createOrUpdateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Multer-S3 will put the uploaded file's S3 URL here:
    const imageUrl = (req.file as any)?.location || "";

    // All form-data text fields come in as strings, so we need to coerce:
    const { qrCode, name, category, unit } = req.body as Record<string, string>;

    // Parse numbers (or undefined if absent/invalid)
    const costPrice =
      req.body.costPrice != null ? parseFloat(req.body.costPrice) : undefined;
    const salePrice =
      req.body.salePrice != null ? parseFloat(req.body.salePrice) : undefined;
    const stockQty =
      req.body.stockQty != null ? parseInt(req.body.stockQty, 10) : undefined;

    if (!qrCode) {
      return res.status(400).json({ error: "Trường qrCode là bắt buộc" });
    }

    // Find existing
    let product = await Product.findOne({ qrCode });
    if (product) {
      // Update only the provided fields
      if (name && name !== product.name) {
        product.name = name;
      }
      if (!isNaN(costPrice!)) {
        product.costPrice = costPrice!;
      }
      if (!isNaN(salePrice!)) {
        product.salePrice = salePrice!;
      }
      if (category) {
        product.category = category;
      }
      if (unit) {
        product.unit = unit;
      }
      if (!isNaN(stockQty!)) {
        // you may choose to set or increment; here we increment
        product.stockQty = product.stockQty + stockQty!;
      }
      if (imageUrl) {
        product.imageUrl = imageUrl;
      }

      await product.save();
      return res
        .status(200)
        .json({
          message: "Cập nhật sản phẩm thành công",
          product,
          status: 200,
        });
    }

    // Create new
    const newProduct = await Product.create({
      qrCode,
      name: name ?? "",
      costPrice: !isNaN(costPrice!) ? costPrice! : 0,
      salePrice: !isNaN(salePrice!) ? salePrice! : 0,
      category: category ?? "Khác",
      unit: unit ?? "cái",
      stockQty: !isNaN(stockQty!) ? stockQty! : 0,
      imageUrl: imageUrl ?? "",
    } as Partial<IProduct>);

    return res
      .status(201)
      .json({
        message: "Tạo sản phẩm mới thành công",
        product: newProduct,
        status: 201,
      });
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};
export const searchProducts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const q = (req.query.q as string)?.trim();
    if (!q) {
      return res.status(400).json({ error: "Không tìm thấy sản phẩm " });
    }
    const regex = new RegExp(q, "i");

    // Thêm collation để search không phân biệt dấu tiếng Việt
    const list = await Product.find({
      $or: [{ name: regex }, { qrCode: regex }],
    })
      .collation({ locale: "vi", strength: 1 })
      .sort("-createdAt");

    res.status(200).json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { qrCode, name } = req.body as { qrCode?: string; name?: string };
    if (!qrCode && !name) {
      res
        .status(400)
        .json({ error: "Phải cung cấp qrCode hoặc name để xóa sản phẩm" });
      return;
    }
    const filter: any = {};
    if (qrCode) filter.qrCode = qrCode;
    if (name) filter.name = name;
    const result = await Product.findOneAndDelete(filter);
    if (!result) {
      res.status(404).json({ error: "Không tìm thấy sản phẩm để xóa" });
      return;
    }
    res
      .status(200)
      .json({ message: "Xóa sản phẩm thành công", product: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const getAllCategory = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Lấy category từ database
    const dbCategories: string[] = await Product.distinct("category");
    // Danh sách mặc định bạn muốn luôn hiển thị
    const defaultCategories = ["Khác"];
    // Kết hợp và loại bỏ trùng
    const allCategories = Array.from(
      new Set([...dbCategories, ...defaultCategories])
    );
    res.status(200).json({
      status: "success",
      data: { categories: allCategories },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
