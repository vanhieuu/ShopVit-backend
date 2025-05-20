"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    qrCode: { type: String, required: true },
    costPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    stockQty: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    unit: { type: String || Number, required: true, default: "cái" },
    imageUrl: { type: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Product", productSchema);
