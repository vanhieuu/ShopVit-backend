"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monthlyReport = void 0;
const Sale_1 = __importDefault(require("../models/Sale"));
const Purchase_1 = __importDefault(require("../models/Purchase"));
const monthlyReport = async (req, res) => {
    try {
        const year = parseInt(req.query.year, 10);
        const month = parseInt(req.query.month, 10);
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        // Tổng doanh thu
        const revenueAgg = await Sale_1.default.aggregate([
            { $match: { createdAt: { $gte: start, $lt: end } } },
            { $project: { value: { $multiply: ["$qty", "$salePrice"] } } },
            { $group: { _id: null, total: { $sum: "$value" } } },
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;
        // Tổng chi phí
        const costAgg = await Purchase_1.default.aggregate([
            { $match: { createdAt: { $gte: start, $lt: end } } },
            { $project: { value: { $multiply: ["$qty", "$purchasePrice"] } } },
            { $group: { _id: null, total: { $sum: "$value" } } },
        ]);
        const totalCost = costAgg[0]?.total || 0;
        res
            .status(200)
            .json({ totalRevenue, totalCost, profit: totalRevenue - totalCost });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.monthlyReport = monthlyReport;
