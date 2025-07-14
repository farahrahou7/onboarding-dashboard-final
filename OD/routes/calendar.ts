import express from "express";
import { connectToDatabase, ObjectId } from "../database";
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const db = await connectToDatabase();
  const items = await db
    .collection("calendaractivities")
    .find({ userId: req.params.userId })
    .toArray();
  res.json(items);
});

router.post("/", async (req, res) => {
  const db = await connectToDatabase();
  const result = await db.collection("calendaractivities").insertOne(req.body);
  res.status(201).json({ _id: result.insertedId });
});

router.delete("/:id", async (req, res) => {
  const db = await connectToDatabase();
  await db
    .collection("calendaractivities")
    .deleteOne({ _id: new ObjectId(req.params.id) });
  res.sendStatus(204);
});

router.patch("/:id/participant", async (req, res) => {
  const db = await connectToDatabase();
  const result = await db
    .collection("calendaractivities")
    .findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $push: { participants: req.body } },
      { returnDocument: "after" }
    );

  if (!result || !result.value) {
    return res.status(404).json({ message: "Activity not found" });
  }

  res.json(result.value);
});

export default router;
