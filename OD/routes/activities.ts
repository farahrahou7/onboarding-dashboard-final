import express, { Request, Response } from "express";
import { connectToDatabase } from "../database";
import { CalendarActivity } from "../models/calenderActivity";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  const db = await connectToDatabase();
  const activities = await db
    .collection<CalendarActivity>("activities")
    .find({})
    .toArray();
  res.json(activities);
});

router.post("/", async (req: Request, res: Response) => {
  const db = await connectToDatabase();
  const newActivity: CalendarActivity = req.body;
  await db.collection<CalendarActivity>("activities").insertOne(newActivity);
  res.status(201).json({ message: "Activity saved" });
});

export default router;
