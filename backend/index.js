import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import checklistRoutes from "./routes/checklist.js";
import noteRoutes from "./routes/notes.js";
import calendarRoutes from "./routes/calendar.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/checklist", checklistRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/calendar", calendarRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error("MongoDB connection failed:", err));
