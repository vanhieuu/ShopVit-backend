import { Router } from "express";
import {
  createOrUpdateProduct,
  deleteProduct,
  getProducts,
  searchProducts,
} from "../controllers/productController";
import { upload } from '../config/s3';
const productRouter = Router();

// Tạo sản phẩm mới
productRouter.post("/", upload.single('image') ,createOrUpdateProduct);

// Lấy danh sách tất cả sản phẩm
productRouter.get("/get-prod", getProducts);

productRouter.get("/get-prod/:category", getProducts);

productRouter.get("/search", searchProducts);

productRouter.delete("/", deleteProduct);

export default productRouter;
