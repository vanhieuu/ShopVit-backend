import { Schema, model, Document, Types } from 'mongoose';

export interface IInvoice extends Document {
  sale: Types.ObjectId;
  issuedAt: Date;
  totalAmount: number;
}

const invoiceSchema = new Schema<IInvoice>({
  sale:        { type: Schema.Types.ObjectId, ref: 'Sale', required: true },
  issuedAt:    { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true }
}, { timestamps: false });

export default model<IInvoice>('Invoice', invoiceSchema);
