import mongoose from "mongoose";
const ChecklistItemSchema = new mongoose.Schema({
  title: String,
  checked: Boolean,
  userId: String,
});
export default mongoose.model("ChecklistItem", ChecklistItemSchema);
