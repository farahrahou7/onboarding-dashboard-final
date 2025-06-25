import mongoose from "mongoose";
const NoteSchema = new mongoose.Schema({
  text: String,
  userId: String,
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("Note", NoteSchema);
