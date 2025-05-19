import { Request, Response } from 'express';
import Sale from '../models/Sale';
import Product from '../models/Product';
import Invoice from '../models/Invoice';
import PDFKit from 'pdfkit';

// Lấy thông tin chi tiết của một hóa đơn theo ID
export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoiceId = req.params.invoiceId;
    const invoice = await Invoice.findById(invoiceId)
      .populate({ path: 'sale', populate: { path: 'product', model: 'Product' } })
      .lean();
    if (!invoice) {
      res.status(404).json({ error: 'Không tìm thấy hóa đơn' });
      return;
    }
    res.status(200).json(invoice);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Sinh hóa đơn và lưu thông tin
export const generateInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const saleId = req.params.saleId;
    const sale = await Sale.findById(saleId).lean();
    if (!sale) {
      res.status(404).json({ error: 'Không tìm thấy đơn bán' });
      return;
    }
    const prod = await Product.findById(sale.product).lean();
    const totalAmount = sale.qty * sale.salePrice;
    await Invoice.create({ sale: sale._id, totalAmount });
    const doc = new PDFKit();
    res.setHeader('Content-disposition', `attachment; filename=invoice-${saleId}.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);
    doc.fontSize(20).text('HÓA ĐƠN BÁN HÀNG', { align: 'center' }).moveDown();
    doc.fontSize(12)
      .text(`Mã hóa đơn: ${saleId}`)
      .text(`Ngày: ${new Date(sale.createdAt).toLocaleDateString()}`)
      .moveDown();
    doc.text(`Sản phẩm: ${prod?.name}`)
      .text(`Số lượng: ${sale.qty}`)
      .text(`Đơn giá: ${sale.salePrice}`)
      .text(`Thành tiền: ${totalAmount}`)
      .moveDown();
    doc.fontSize(14).text(`Tổng: ${totalAmount}`, { align: 'right' });
    doc.end();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
