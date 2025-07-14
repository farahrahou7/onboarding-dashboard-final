import express from "express";
import { connectToDatabase, ObjectId } from "../database";
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const db = await connectToDatabase();
  const notes = await db
    .collection("notes")
    .find({ userId: req.params.userId })
    .toArray();
  res.json(notes);
});

router.post("/", async (req, res) => {
  const db = await connectToDatabase();
  const result = await db
    .collection("notes")
    .insertOne({ ...req.body, createdAt: new Date() });
  res.status(201).json({ _id: result.insertedId });
});

router.delete("/:id", async (req, res) => {
  const db = await connectToDatabase();
  await db.collection("notes").deleteOne({ _id: new ObjectId(req.params.id) });
  res.sendStatus(204);
});

router.put("/:id", async (req, res) => {
  const db = await connectToDatabase();
  const result = await db
    .collection("notes")
    .findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { text: req.body.text } },
      { returnDocument: "after" }
    );

  if (!result || !result.value) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json(result.value);
});

export default router;
