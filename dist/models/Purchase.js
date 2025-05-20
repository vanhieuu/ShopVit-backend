"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const purchaseSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Purchase", purchaseSchema);
