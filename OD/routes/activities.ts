import express, { Request, Response } from "express";
import clientPromise from "../database";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  const client = await clientPromise;
  const activities = await client.db("onboarding").collection("activities").find({}).toArray();
  res.json(activities);
});

router.post("/", async (req: Request, res: Response) => {
  const client = await clientPromise;
  await client.db("onboarding").collection("activities").insertOne(req.body);
  res.status(201).json({ message: "Activity saved" });
});

export default router;