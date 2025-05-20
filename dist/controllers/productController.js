"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategory = exports.deleteProduct = exports.searchProducts = exports.createOrUpdateProduct = exports.getProductsByCategory = exports.getProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const createProduct = async (req, res) => {
    try {
        const body = req.body;
        const product = await Product_1.default.create(body);
        res.status(201).json({
            status: "success",
            data: {
                product,
            },
        });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createProduct = createProduct;
const getProducts = async (_req, res) => {
    try {
        const products = await Product_1.default.find().sort("-createdAt");
        // Đảm bảo category luôn có giá trị
        const list = products.map((p) => ({
            _id: p._id,
            name: p.name,
            qrCode: p.qrCode,
            costPrice: p.costPrice,
            salePrice: p.salePrice,
            stockQty: p.stockQty,
            category: p.category || "Khác",
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            imageUrl: p.imageUrl,
            unit: p.unit,
            __v: p.__v,
        }));
        res.status(200).json({
            status: "success",
            data: { list },
        });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.getProducts = getProducts;
const getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const list = await Product_1.default.find({ category }).sort("-createdAt");
        res.status(200).json(list);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProductsByCategory = getProductsByCategory;
const createOrUpdateProduct = async (req, res) => {
    try {
        // Multer-S3 will put the uploaded file's S3 URL here:
        const imageUrl = req.file?.location || "";
        // All form-data text fields come in as strings, so we need to coerce:
        const { qrCode, name, category, unit } = req.body;
        // Parse numbers (or undefined if absent/invalid)
        const costPrice = req.body.costPrice != null ? parseFloat(req.body.costPrice) : undefined;
        const salePrice = req.body.salePrice != null ? parseFloat(req.body.salePrice) : undefined;
        const stockQty = req.body.stockQty != null ? parseInt(req.body.stockQty, 10) : undefined;
        if (!qrCode) {
            return res.status(400).json({ error: "Trường qrCode là bắt buộc" });
        }
        // Find existing
        let product = await Product_1.default.findOne({ qrCode });
        if (product) {
            // Update only the provided fields
            if (name && name !== product.name) {
                product.name = name;
            }
            if (!isNaN(costPrice)) {
                product.costPrice = costPrice;
            }
            if (!isNaN(salePrice)) {
                product.salePrice = salePrice;
            }
            if (category) {
                product.category = category;
            }
            if (unit) {
                product.unit = unit;
            }
            if (!isNaN(stockQty)) {
                // you may choose to set or increment; here we increment
                product.stockQty = product.stockQty + stockQty;
            }
            if (imageUrl) {
                product.imageUrl = imageUrl;
            }
            await product.save();
            return res
                .status(200)
                .json({ message: "Cập nhật sản phẩm thành công", product });
        }
        // Create new
        const newProduct = await Product_1.default.create({
            qrCode,
            name: name ?? "",
            costPrice: !isNaN(costPrice) ? costPrice : 0,
            salePrice: !isNaN(salePrice) ? salePrice : 0,
            category: category ?? "Khác",
            unit: unit ?? "cái",
            stockQty: !isNaN(stockQty) ? stockQty : 0,
            imageUrl: imageUrl ?? "",
        });
        return res
            .status(201)
            .json({ message: "Tạo sản phẩm mới thành công", product: newProduct });
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
};
exports.createOrUpdateProduct = createOrUpdateProduct;
const searchProducts = async (req, res) => {
    try {
        const q = req.query.q?.trim();
        if (!q) {
            return res.status(400).json({ error: "Không tìm thấy sản phẩm " });
        }
        const regex = new RegExp(q, "i");
        // Thêm collation để search không phân biệt dấu tiếng Việt
        const list = await Product_1.default.find({
            $or: [{ name: regex }, { qrCode: regex }],
        })
            .collation({ locale: "vi", strength: 1 })
            .sort("-createdAt");
        res.status(200).json(list);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.searchProducts = searchProducts;
const deleteProduct = async (req, res) => {
    try {
        const { qrCode, name } = req.body;
        if (!qrCode && !name) {
            res
                .status(400)
                .json({ error: "Phải cung cấp qrCode hoặc name để xóa sản phẩm" });
            return;
        }
        const filter = {};
        if (qrCode)
            filter.qrCode = qrCode;
        if (name)
            filter.name = name;
        const result = await Product_1.default.findOneAndDelete(filter);
        if (!result) {
            res.status(404).json({ error: "Không tìm thấy sản phẩm để xóa" });
            return;
        }
        res
            .status(200)
            .json({ message: "Xóa sản phẩm thành công", product: result });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteProduct = deleteProduct;
const getAllCategory = async (_req, res) => {
    try {
        // Lấy category từ database
        const dbCategories = await Product_1.default.distinct("category");
        // Danh sách mặc định bạn muốn luôn hiển thị
        const defaultCategories = ["Khác"];
        // Kết hợp và loại bỏ trùng
        const allCategories = Array.from(new Set([...dbCategories, ...defaultCategories]));
        res.status(200).json({
            status: "success",
            data: { categories: allCategories },
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllCategory = getAllCategory;
