// src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productRouter from './routes/productRoutes';
import purchaseRouter from './routes/purchaseRoutes';

import reportRouter from './routes/reportRoutes';
import invoiceRouter from './routes/invoiceRoutes';
import saleRouter from './routes/saleRoute';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
const URL = 'mongodb+srv://thandieudaihiep2916:8rGlwVivzsIbPx95@cluster1.zhjycw9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1'
const MONGO_URI = process.env.MONGO_URI || URL;
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Mount routers with version prefix v1
app.use('/api/v1/products', productRouter);
app.use('/api/v1/purchase', purchaseRouter);
app.use('/api/v1/sale',     saleRouter);
app.use('/api/v1/report',   reportRouter);
app.use('/api/v1/invoice',  invoiceRouter);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
