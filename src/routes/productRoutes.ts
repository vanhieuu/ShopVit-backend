import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/productController';

const productRouter = Router();

// Tạo sản phẩm mới
productRouter.post('/', createProduct);

// Lấy danh sách tất cả sản phẩm
productRouter.get('/', getProducts);




export default productRouter;