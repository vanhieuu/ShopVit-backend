import { Schema, model, Document, Types } from "mongoose";

export interface IPurchase extends Document {
  product: Types.ObjectId;
  qty: number;
  purchasePrice: number;
  createdAt: Date;
  updatedAt: Date;
}
const purchaseSchema = new Schema<IPurchase>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
  },
  { timestamps: true }
);
export default model<IPurchase>("Purchase", purchaseSchema);
