import { Router } from 'express';
import { monthlyReport } from '../controllers/reportController';

const reportRouter = Router();

// Báo cáo doanh thu, chi phí, lợi nhuận theo tháng
reportRouter.get('/monthly', monthlyReport);

export default reportRouter;