"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllInvoices = exports.getInvoice = exports.generateInvoice = void 0;
const Sale_1 = __importDefault(require("../models/Sale"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const Invoice_1 = __importDefault(require("../models/Invoice"));
const generateInvoice = async (req, res) => {
    try {
        const invoiceId = req.params.saleId;
        const sale = await Sale_1.default.findById(invoiceId)
            .populate('items.product')
            .lean();
        if (!sale) {
            res.status(404).json({ error: 'Không tìm thấy đơn bán' });
            return;
        }
        const doc = new pdfkit_1.default();
        res.setHeader('Content-disposition', `attachment; filename=invoice-${invoiceId}.pdf`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);
        doc.fontSize(20).text('HÓA ĐƠN BÁN HÀNG', { align: 'center' }).moveDown();
        doc.fontSize(12).text(`Mã hóa đơn: ${invoiceId}`).text(`Ngày: ${new Date(sale.createdAt).toLocaleDateString()}`).moveDown();
        let totalAmount = 0;
        sale.items.forEach(item => {
            const prod = item.product;
            const lineTotal = item.qty * item.salePrice;
            totalAmount += lineTotal;
            doc.text(`${prod.name} - ${item.qty} x ${item.salePrice} = ${lineTotal}`);
        });
        doc.moveDown().fontSize(14).text(`Tổng cộng: ${totalAmount}`, { align: 'right' });
        doc.end();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.generateInvoice = generateInvoice;
const getInvoice = async (req, res) => {
    try {
        const invoiceId = req.params.saleId;
        const sale = await Sale_1.default.findById(invoiceId)
            .populate('items.product')
            .lean();
        if (!sale) {
            res.status(404).json({ error: 'Không tìm thấy đơn bán' });
            return;
        }
        res.status(200).json(sale);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getInvoice = getInvoice;
const getAllInvoices = async (_req, res) => {
    try {
        const invoices = await Invoice_1.default.find()
            .populate({
            path: 'sale',
            populate: { path: 'items.product', model: 'Product' }
        })
            .lean();
        res.status(200).json({
            status: 'success',
            data: { invoices }
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllInvoices = getAllInvoices;
