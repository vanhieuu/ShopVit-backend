import { Schema, model, Document } from "mongoose";
export interface IProduct extends Document {
  name: string;
  qrCode: string;
  costPrice: number;
  salePrice: number;
  stockQty: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchemea = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    qrCode: { type: String, required: true },
    costPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    stockQty: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);
export default model<IProduct>("Product", productSchemea);
