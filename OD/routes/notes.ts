import express, { Request, Response } from "express";
import Note, { INote } from "../models/note";

const router = express.Router();

// ✅ Haal notities op voor een specifieke gebruiker
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const notes: INote[] = await Note.find({ userId: req.params.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// ✅ Voeg een nieuwe notitie toe
router.post("/", async (req: Request, res: Response) => {
  try {
    const newNote = new Note(req.body);
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ error: "Failed to save note" });
  }
});

// ✅ Verwijder een notitie
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: "Failed to delete note" });
  }
});

export default router;
