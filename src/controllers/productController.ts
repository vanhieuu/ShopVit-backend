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
    const { qrCode, name, costPrice, salePrice, category,stockQty } =
      req.body as Partial<IProduct>;
    // Tìm sản phẩm theo qrCode hoặc name nếu cung cấp
    let product = null;
    if (qrCode) {
      product = await Product.findOne({ qrCode });
    }
    if (!product && name) {
      product = await Product.findOne({ name });
    }

    if (product) {
      // Đã có sẵn: cập nhật thông tin nếu cần
      if (costPrice !== undefined) product.costPrice = costPrice;
      if (salePrice !== undefined) product.salePrice = salePrice;
      if (category) product.category = category;
      await product.save();
      return res
        .status(200)
        .json({ message: "Cập nhật sản phẩm thành công", product });
    }

    // Không tồn tại: tạo mới
    const newProduct = await Product.create({
      qrCode: qrCode ?? "",
      name: name ?? "",
      costPrice: costPrice ?? 0,
      salePrice: salePrice ?? 0,
      category: category ?? "Khác",
      stockQty:stockQty ?? 0
    });

    res
      .status(201)
      .json({ message: "Tạo sản phẩm mới thành công", product: newProduct });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
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
