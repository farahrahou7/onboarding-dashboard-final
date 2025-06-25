import express from "express";
import ChecklistItem from "../models/ChecklistItem.js";
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const items = await ChecklistItem.find({ userId: req.params.userId });
  res.json(items);
});

router.post("/", async (req, res) => {
  const newItem = new ChecklistItem(req.body);
  await newItem.save();
  res.json(newItem);
});

router.put("/:id", async (req, res) => {
  const updated = await ChecklistItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await ChecklistItem.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
