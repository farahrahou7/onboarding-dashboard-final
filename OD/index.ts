import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import checklistRoutes from "./routes/checklist";
import noteRoutes from "./routes/notes";
import calendarRoutes from "./routes/calendar";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const PORT: string | number = process.env.PORT || 5000;

// ➤ Middleware
app.use(cors());
app.use(express.json());

// ➤ Static frontend files
app.use(express.static(path.join(__dirname, "public")));

// ➤ API routes
app.use("/api", authRoutes);
app.use("/api/checklist", checklistRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/calendar", calendarRoutes);

// ➤ Root route: redirect naar login.html
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ➤ Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ➤ MongoDB connectie + serverstart
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err: Error) => console.error("❌ MongoDB connection failed:", err));
