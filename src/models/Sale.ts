import { Schema, model, Document, Types } from 'mongoose';

export interface ISale extends Document {
  product: Types.ObjectId;
  qty: number;
  salePrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const saleSchema = new Schema<ISale>({
  product:   { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  qty:       { type: Number, required: true },
  salePrice: { type: Number, required: true }
}, { timestamps: true });

export default model<ISale>('Sale', saleSchema);