import { Request, Response } from "express";
import Product from "../models/Product";
import Purchase from "../models/Purchase";

export const createPurchase = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { qrCode, qty, purchasePrice } = req.body;
    const prod = await Product.findOne({ qrCode });
    if (!prod) {
      res.status(404).json({ error: "Sản phẩm không tồn tại" });
      return;
    }

    const purchase = await Purchase.create({
      product: prod._id,
      qty,
      purchasePrice,
    });
    prod.stockQty += qty;
    await prod.save();

    res.status(201).json(purchase);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
