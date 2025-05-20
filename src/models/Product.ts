import { Schema, model, Document } from "mongoose";
export interface IProduct extends Document {
  name: string;
  qrCode: string;
  costPrice: number;
  salePrice: number;
  stockQty: number;
  category: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  unit?: any;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    qrCode: { type: String, required: true },
    costPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    stockQty: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    unit: { type: String || Number, required: true ,default:"cái"},
    imageUrl: { type: String },
  },
  { timestamps: true }
);
export default model<IProduct>("Product", productSchema);
