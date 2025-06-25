import mongoose from "mongoose";
const CalendarActivitySchema = new mongoose.Schema({
  title: String,
  date: String,
  userId: String,
});
export default mongoose.model("CalendarActivity", CalendarActivitySchema);
