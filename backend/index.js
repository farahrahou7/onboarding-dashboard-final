import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import checklistRoutes from "./routes/checklist.js";
import noteRoutes from "./routes/notes.js";
import calendarRoutes from "./routes/calendar.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Nodig voor __dirname simulatie (ES module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/checklist", checklistRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/calendar", calendarRoutes);

// Serve frontend statische bestanden
app.use(express.static(path.join(__dirname, "../frontend")));

// Fallback naar index.html voor alle niet-API routes
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// MongoDB connectie + server starten
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

