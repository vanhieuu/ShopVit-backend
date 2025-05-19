import { Request, Response } from 'express';
import Sale from '../models/Sale';
import Product from '../models/Product';

// Tạo phiếu bán hàng
export const createSale = async (req: Request, res: Response): Promise<any> => {
  try {
    const { qrCode, name, qty, salePrice } = req.body;
    let prod = null;
    if (qrCode) {
      prod = await Product.findOne({ qrCode });
    }
    if (!prod && name) {
      prod = await Product.findOne({ name });
    }
    if (!prod) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }
    if (prod.stockQty < qty) {
      return res.status(400).json({ error: 'Không đủ tồn kho' });
    }

    const sale = await Sale.create({ product: prod._id, qty, salePrice });
    prod.stockQty -= qty;
    await prod.save();

    res.status(201).json({ message: 'Bán hàng thành công', sale, product: prod });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};