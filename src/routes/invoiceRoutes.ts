import { Router } from 'express';
import { getInvoice, generateInvoice, getAllInvoices } from '../controllers/invoiceController';

const invoiceRouter = Router();

// Lấy thông tin đơn bán (hóa đơn)
invoiceRouter.get('/:saleId', getInvoice);

// Sinh PDF hóa đơn
invoiceRouter.get('/:saleId/pdf', generateInvoice);

// Lấy tất cả hóa đơn
invoiceRouter.get('/', getAllInvoices);
export default invoiceRouter;