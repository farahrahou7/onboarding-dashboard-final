import mongoose, { Document, Schema } from "mongoose";

// TypeScript interface
export interface INote extends Document {
  text: string;
  userId: string;
  createdAt: Date;
}

// Mongoose schema met validatie
const NoteSchema: Schema = new Schema({
  text: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Export model
export default mongoose.model<INote>("Note", NoteSchema);
