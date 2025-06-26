import mongoose, { Document, Schema } from "mongoose";

// Interface voor TypeScript type safety
export interface IChecklistItem extends Document {
  title: string;
  checked: boolean;
  userId: string;
}

// Mongoose schema met validatie
const ChecklistItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  checked: { type: Boolean, default: false },
  userId: { type: String, required: true },
});

// Export model
export default mongoose.model<IChecklistItem>("ChecklistItem", ChecklistItemSchema);
