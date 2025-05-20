"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const invoiceSchema = new mongoose_1.Schema({
    sale: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Sale', required: true },
    issuedAt: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true }
}, { timestamps: false });
exports.default = (0, mongoose_1.model)('Invoice', invoiceSchema);
