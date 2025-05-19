import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRouter from "./routes/productRoutes";
import purchaseRouter from "./routes/purchaseRoutes";
import reportRouter from "./routes/reportRoutes";
import invoiceRouter from "./routes/invoiceRoutes";
import saleRouter from "./routes/saleRoute";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const URL_DATABASE = "mongodb+srv://thandieudaihiep2916:8rGlwVivzsIbPx95@cluster1.zhjycw9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
const MONGO_URI = process.env.MONGO_URI || URL_DATABASE;
console.log(MONGO_URI,'môngoURL')
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/v1/products", productRouter);
app.use("/api/v1/purchases", purchaseRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/sales", saleRouter);

app.use((err:Error,req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
  res.status(404).json({
    status: "404",
    message: err.message,
    type:'fail'
  });
});
const PORT = process.env.PORT  ? parseInt(process.env.PORT,10) : 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
export default app;
