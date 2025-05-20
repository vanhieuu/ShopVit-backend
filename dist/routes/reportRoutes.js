"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const reportRouter = (0, express_1.Router)();
// Báo cáo doanh thu, chi phí, lợi nhuận theo tháng
reportRouter.get('/monthly', reportController_1.monthlyReport);
exports.default = reportRouter;
