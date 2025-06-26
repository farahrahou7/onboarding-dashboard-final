import mongoose, { Document, Schema } from "mongoose";

export interface ICalendarActivity extends Document {
  title: string;
  date: string;
  userId: string;
}

const CalendarActivitySchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  userId: { type: String, required: true },
});

export default mongoose.model<ICalendarActivity>("CalendarActivity", CalendarActivitySchema);
