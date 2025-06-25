import express from "express";
import CalendarActivity from "../models/CalendarActivity.js";
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const items = await CalendarActivity.find({ userId: req.params.userId });
  res.json(items);
});

router.post("/", async (req, res) => {
  const newItem = new CalendarActivity(req.body);
  await newItem.save();
  res.json(newItem);
});

router.delete("/:id", async (req, res) => {
  await CalendarActivity.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
