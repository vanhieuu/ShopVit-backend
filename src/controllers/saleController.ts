import { Request, Response } from "express";
import Product from "../models/Product";
import Sale from "../models/Sale";

export const createSale = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { qrCode, qty, salePrice } = req.body;
    const prod = await Product.findOne({ qrCode });
    if (!prod) {
      res.status(404).json({ error: "Sản phẩm không tồn tại" });
      return;
    }
    if (prod.stockQty < qty) {
      res.status(400).json({ error: "Không đủ tồn kho" });
      return;
    }

    const sale = await Sale.create({ product: prod._id, qty, salePrice });
    prod.stockQty -= qty;
    await prod.save();

    res.status(201).json(sale);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
