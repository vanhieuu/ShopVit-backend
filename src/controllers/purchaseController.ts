import { Request, Response } from "express";
import Product from "../models/Product";
import Purchase from "../models/Purchase";

export const createPurchase = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { qrCode, name, qty, purchasePrice, salePrice, category } = req.body;
    let prod = null;
    if (qrCode) {
      prod = await Product.findOne({ qrCode });
    }
    if (!prod && name) {
      prod = await Product.findOne({ name });
    }

    if (!prod) {
      // Tạo mới sản phẩm nếu chưa có
      if (
        !name ||
        purchasePrice === undefined ||
        salePrice === undefined ||
        !category
      ) {
        return res
          .status(400)
          .json({ error: "Thiếu thông tin để tạo sản phẩm mới" });
      }
      prod = await Product.create({
        qrCode: qrCode ?? "",
        name,
        costPrice: purchasePrice,
        salePrice,
        category,
      });
    }

    // Tạo phiếu nhập
    const purchase = await Purchase.create({
      product: prod._id,
      qty,
      purchasePrice,
    });
    // Cập nhật stock
    prod.stockQty += qty;
    await prod.save();

    res
      .status(201)
      .json({ message: "Nhập hàng thành công", purchase, product: prod });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
