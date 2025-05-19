import { Router } from 'express';
import { getInvoiceById, generateInvoice } from '../controllers/invoiceController';

const invoiceRouter = Router();

// Lấy metadata hóa đơn theo ID
invoiceRouter.get('/info/:invoiceId', getInvoiceById);

// Sinh PDF hóa đơn và lưu thông tin theo saleId
invoiceRouter.get('/generate/:saleId', generateInvoice);

export default invoiceRouter;