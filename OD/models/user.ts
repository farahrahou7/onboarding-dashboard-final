import express from "express";
import { connectToDatabase, ObjectId } from "../database";
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
        { returnDocument: "after" }
      );

    if (!result || !result.value) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.value);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

export default router;
