"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoiceController_1 = require("../controllers/invoiceController");
const invoiceRouter = (0, express_1.Router)();
// Lấy thông tin đơn bán (hóa đơn)
invoiceRouter.get('/:saleId', invoiceController_1.getInvoice);
// Sinh PDF hóa đơn
invoiceRouter.get('/:saleId/pdf', invoiceController_1.generateInvoice);
// Lấy tất cả hóa đơn
invoiceRouter.get('/', invoiceController_1.getAllInvoices);
exports.default = invoiceRouter;
