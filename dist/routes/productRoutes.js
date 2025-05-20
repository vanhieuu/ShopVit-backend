"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const s3_1 = require("../config/s3");
const productRouter = (0, express_1.Router)();
// Tạo sản phẩm mới
productRouter.post("/", s3_1.upload.single('image'), productController_1.createOrUpdateProduct);
// Lấy danh sách tất cả sản phẩm
productRouter.get("/get-prod", productController_1.getProducts);
productRouter.get("/get-prod/:category", productController_1.getProducts);
productRouter.get("/search", productController_1.searchProducts);
productRouter.delete("/", productController_1.deleteProduct);
productRouter.get('/get-cate', productController_1.getAllCategory);
exports.default = productRouter;
