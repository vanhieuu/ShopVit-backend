import { Router } from 'express';
import { createSale } from '../controllers/saleController';

const saleRouter = Router();

// Bán hàng
saleRouter.post('/', createSale);

export default saleRouter;

