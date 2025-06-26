import express, { Request, Response } from "express";
import ChecklistItem, { IChecklistItem } from "../models/checkListItem";

const router = express.Router();

// ✅ Haal alle checklist-items op voor één gebruiker
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const items: IChecklistItem[] = await ChecklistItem.find({ userId: req.params.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch checklist items" });
  }
});

// ✅ Voeg een nieuw item toe
router.post("/", async (req: Request, res: Response) => {
  try {
    const newItem = new ChecklistItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ error: "Failed to save checklist item" });
  }
});

// ✅ Update een bestaand item
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedItem = await ChecklistItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: "Failed to update checklist item" });
  }
});

// ✅ Verwijder een item
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await ChecklistItem.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: "Failed to delete checklist item" });
  }
});

export default router;
