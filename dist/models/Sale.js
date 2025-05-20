"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Sale.ts
const mongoose_1 = require("mongoose");
const saleSchema = new mongoose_1.Schema({
    items: [{
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
            qty: { type: Number, required: true },
            salePrice: { type: Number, required: true },
        }]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Sale', saleSchema);
