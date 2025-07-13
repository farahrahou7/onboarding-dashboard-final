import express, { Request, Response } from "express";
import CalendarActivity, { ICalendarActivity } from "../models/calenderActivity";

const router = express.Router();

// ✅ Haal activiteiten op voor specifieke gebruiker
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const items: ICalendarActivity[] = await CalendarActivity.find({ userId: req.params.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch calendar activities" });
  }
});

// ✅ Voeg een nieuwe activiteit toe (inclusief materiaal)
router.post("/", async (req: Request, res: Response) => {
  const { title, date, userId, equipment } = req.body;

  try {
    const newItem = new CalendarActivity({
      title,
      date,
      userId,
      equipment: Array.isArray(equipment) ? equipment : []  // Fallback
    });
    console.log("Ontvangen body:", req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Fout bij opslaan activiteit:", err);
    res.status(500).json({ error: "Failed to add activity" });
  }
});

// ✅ Verwijder een activiteit
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await CalendarActivity.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: "Failed to delete calendar activity" });
  }
});

router.patch("/:id/participant/:id", async (req: Request, res: Response) => {
  const { firstName, lastName } = req.body;
  try {
    const updated = await CalendarActivity.findByIdAndUpdate(
      req.params.id,
      { $push: { participants: { firstName, lastName } } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Kon deelnemer niet toevoegen" });
  }
});

export default router;
