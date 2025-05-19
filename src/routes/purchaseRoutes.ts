import { Router } from 'express';
import { createPurchase } from '../controllers/purchaseController';


const purchaseRouter = Router();

// Nhập hàng
purchaseRouter.post('/', createPurchase);

export default purchaseRouter;
