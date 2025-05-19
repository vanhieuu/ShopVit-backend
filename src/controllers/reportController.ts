import { Request, Response } from "express";
import Sale from "../models/Sale";
import Purchase from "../models/Purchase";

export const monthlyReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const year = parseInt(req.query.year as string, 10);
    const month = parseInt(req.query.month as string, 10);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    // Tổng doanh thu
    const revenueAgg = await Sale.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end } } },
      { $project: { value: { $multiply: ["$qty", "$salePrice"] } } },
      { $group: { _id: null, total: { $sum: "$value" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Tổng chi phí
    const costAgg = await Purchase.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end } } },
      { $project: { value: { $multiply: ["$qty", "$purchasePrice"] } } },
      { $group: { _id: null, total: { $sum: "$value" } } },
    ]);
    const totalCost = costAgg[0]?.total || 0;

    res
      .status(200)
      .json({ totalRevenue, totalCost, profit: totalRevenue - totalCost });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
