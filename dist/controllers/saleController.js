"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSale = void 0;
const Sale_1 = __importDefault(require("../models/Sale"));
const Product_1 = __importDefault(require("../models/Product"));
const Invoice_1 = __importDefault(require("../models/Invoice"));
const createSale = async (req, res) => {
    try {
        const { items } = req.body;
        // Xử lý từng item: trừ kho, thu thập ObjectId + giá
        const saleItems = await Promise.all(items.map(async ({ qrCode, name, qty, salePrice }) => {
            let prod = qrCode
                ? await Product_1.default.findOne({ qrCode })
                : await Product_1.default.findOne({ name: name });
            if (!prod)
                throw new Error(`Sản phẩm không tồn tại: ${qrCode || name}`);
            if (prod.stockQty < qty)
                throw new Error(`Không đủ tồn kho cho ${prod.name}`);
            prod.stockQty -= qty;
            await prod.save();
            return { product: prod._id, qty, salePrice };
        }));
        // Tạo Sale
        const sale = await Sale_1.default.create({ items: saleItems });
        // Tính tổng để tạo Invoice
        const totalAmount = saleItems.reduce((sum, it) => sum + it.qty * it.salePrice, 0);
        const invoice = await Invoice_1.default.create({ sale: sale._id, totalAmount });
        // Trả về cả saleId và invoiceId
        res.status(201).json({
            message: 'Tạo đơn bán và hóa đơn thành công',
            data: {
                saleId: sale._id,
                invoiceId: invoice._id,
            }
        });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createSale = createSale;
