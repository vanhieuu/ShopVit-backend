"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPurchase = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Purchase_1 = __importDefault(require("../models/Purchase"));
const createPurchase = async (req, res) => {
    try {
        const { qrCode, name, qty, purchasePrice, salePrice, category } = req.body;
        let prod = null;
        if (qrCode) {
            prod = await Product_1.default.findOne({ qrCode });
        }
        if (!prod && name) {
            prod = await Product_1.default.findOne({ name });
        }
        if (!prod) {
            // Tạo mới sản phẩm nếu chưa có
            if (!name ||
                purchasePrice === undefined ||
                salePrice === undefined ||
                !category) {
                return res
                    .status(400)
                    .json({ error: "Thiếu thông tin để tạo sản phẩm mới" });
            }
            prod = await Product_1.default.create({
                qrCode: qrCode ?? "",
                name,
                costPrice: purchasePrice,
                salePrice,
                category,
            });
        }
        // Tạo phiếu nhập
        const purchase = await Purchase_1.default.create({
            product: prod._id,
            qty,
            purchasePrice,
        });
        // Cập nhật stock
        prod.stockQty += qty;
        await prod.save();
        res
            .status(201)
            .json({ message: "Nhập hàng thành công", purchase, product: prod });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createPurchase = createPurchase;
