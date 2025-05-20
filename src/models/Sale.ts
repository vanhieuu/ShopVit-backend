// src/models/Sale.ts
import { Schema, model, Document, Types } from 'mongoose';

interface ISaleItem {
  product: Types.ObjectId;
  qty: number;
  salePrice: number;
}

export interface ISale extends Document {
  items: ISaleItem[];
  createdAt: Date;
  updatedAt: Date;
}

const saleSchema = new Schema<ISale>({
  items: [{
    product:   { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    qty:       { type: Number, required: true },
    salePrice: { type: Number, required: true },
  }]
}, { timestamps: true });

export default model<ISale>('Sale', saleSchema);
