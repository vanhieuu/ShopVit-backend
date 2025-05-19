import { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body as Partial<IProduct>;
    const product = await Product.create(body);
    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
export const getProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const list = await Product.find().sort("-createdAt");
    res.status(200).json({
      status: "success",
      data: {
        list,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.params.category as string;
    const list = await Product.find({ category }).sort('-createdAt');
    res.status(200).json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};