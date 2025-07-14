import express from "express";
import { connectToDatabase, ObjectId } from "../database";
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const db = await connectToDatabase();
  const items = await db
    .collection("checklistitems")
    .find({ userId: req.params.userId })
    .toArray();
  res.json(items);
});

router.post("/", async (req, res) => {
  const db = await connectToDatabase();
  const result = await db.collection("checklistitems").insertOne(req.body);
  res.status(201).json({ _id: result.insertedId });
});

router.put("/:id", async (req, res) => {
  const db = await connectToDatabase();
  const result = await db
    .collection("checklistitems")
    .findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { returnDocument: "after" }
    );

  if (!result || !result.value) {
    return res.status(404).json({ message: "Checklist item not found" });
  }

  res.json(result.value);
});

router.delete("/:id", async (req, res) => {
  const db = await connectToDatabase();
  await db
    .collection("checklistitems")
    .deleteOne({ _id: new ObjectId(req.params.id) });
  res.sendStatus(204);
});

export default router;
