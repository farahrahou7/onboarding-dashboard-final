import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import debugRoutes from "./routes/debug";
import checklistRoutes from "./routes/checklist";
import noteRoutes from "./routes/notes";
import calendarRoutes from "./routes/calendar";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
// ➤ Middleware
app.use(cors());
app.use(express.json());

// ➤ Static frontend files
app.use(express.static(path.join(__dirname, "public")));

// ➤ API routes
app.use("/api/debug", debugRoutes);
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
