// src/controllers/saleController.ts
import { Request, Response } from 'express';
import Sale from '../models/Sale';
import Product from '../models/Product';
import Invoice from '../models/Invoice';

export const createSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items } = req.body as {
      items: { qrCode?: string; name?: string; qty: number; salePrice: number }[];
    };

    // Xử lý từng item: trừ kho, thu thập ObjectId + giá
    const saleItems = await Promise.all(items.map(async ({ qrCode, name, qty, salePrice }) => {
      let prod = qrCode
        ? await Product.findOne({ qrCode })
        : await Product.findOne({ name: name! });
      if (!prod) throw new Error(`Sản phẩm không tồn tại: ${qrCode || name}`);
      if (prod.stockQty < qty) throw new Error(`Không đủ tồn kho cho ${prod.name}`);
      prod.stockQty -= qty;
      await prod.save();
      return { product: prod._id, qty, salePrice };
    }));

    // Tạo Sale
    const sale = await Sale.create({ items: saleItems });

    // Tính tổng để tạo Invoice
    const totalAmount = saleItems.reduce((sum, it) => sum + it.qty * it.salePrice, 0);
    const invoice = await Invoice.create({ sale: sale._id, totalAmount });

    // Trả về cả saleId và invoiceId
    res.status(201).json({
      message: 'Tạo đơn bán và hóa đơn thành công',
      data: {
        saleId:    sale._id,
        invoiceId: invoice._id,
      }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
