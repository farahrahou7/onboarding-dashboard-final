import express, { Request, Response } from "express";
import { connectToDatabase } from "../database";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  const db = await connectToDatabase();
  const data = await db.collection("materials").find({}).toArray();
  res.json(data);
});

router.post("/", async (req: Request, res: Response) => {
  const db = await connectToDatabase();
  await db.collection("materials").insertOne(req.body);
  res.status(201).json({ message: "Material saved" });
});

export default router;
