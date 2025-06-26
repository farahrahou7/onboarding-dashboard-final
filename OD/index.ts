import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import checklistRoutes from "./routes/checklist";
import noteRoutes from "./routes/notes";
import calendarRoutes from "./routes/calendar";
import path from "path";

dotenv.config();

const app = express();
const PORT: string | number = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

app.use("/api/checklist", checklistRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/calendar", calendarRoutes);

// Error handler (optioneel)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err: Error) => console.error("MongoDB connection failed:", err));

  app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

