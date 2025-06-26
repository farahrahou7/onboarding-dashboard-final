import express, { Request, Response } from "express";
import clientPromise from "../database";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  const client = await clientPromise;
  const data = await client.db("onboarding").collection("materials").find({}).toArray();
  res.json(data);
});

router.post("/", async (req: Request, res: Response) => {
  const client = await clientPromise;
  await client.db("onboarding").collection("materials").insertOne(req.body);
  res.status(201).json({ message: "Material saved" });
});

export default router;
