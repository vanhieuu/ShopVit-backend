// src/controllers/invoiceController.ts
import { Request, Response } from 'express';
import Sale from '../models/Sale';
import PDFKit from 'pdfkit';
import Invoice from '../models/Invoice';

export const generateInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoiceId = req.params.saleId;
    const sale = await Sale.findById(invoiceId)
      .populate('items.product')
      .lean();
    if (!sale) {
      res.status(404).json({ error: 'Không tìm thấy đơn bán' });
      return;
    }

    const doc = new PDFKit();
    res.setHeader('Content-disposition', `attachment; filename=invoice-${invoiceId}.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(20).text('HÓA ĐƠN BÁN HÀNG', { align: 'center' }).moveDown();
    doc.fontSize(12).text(`Mã hóa đơn: ${invoiceId}`).text(`Ngày: ${new Date(sale.createdAt).toLocaleDateString()}`).moveDown();

    let totalAmount = 0;
    sale.items.forEach(item => {
      const prod = (item.product as any);
      const lineTotal = item.qty * item.salePrice;
      totalAmount += lineTotal;
      doc.text(`${prod.name} - ${item.qty} x ${item.salePrice} = ${lineTotal}`);
    });

    doc.moveDown().fontSize(14).text(`Tổng cộng: ${totalAmount}`, { align: 'right' });
    doc.end();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const getInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoiceId = req.params.saleId;
    const sale = await Sale.findById(invoiceId)
      .populate('items.product')
      .lean();
    if (!sale) {
      res.status(404).json({ error: 'Không tìm thấy đơn bán' });
      return;
    }
    res.status(200).json(sale);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const getAllInvoices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const invoices = await Invoice.find()
      .populate({
        path: 'sale',
        populate: { path: 'items.product', model: 'Product' }
      })
      .lean();

    res.status(200).json({
      status: 'success',
      data: { invoices }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};