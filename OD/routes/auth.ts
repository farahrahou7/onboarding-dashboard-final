import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret"; // gebruik een echte geheime key in productie

// ✅ REGISTER
router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Gebruiker bestaat al" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Gebruiker aangemaakt" });
  } catch (err) {
    res.status(500).json({ message: "Serverfout bij registratie" });
  }
});

// ✅ LOGIN
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Ongeldige login" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Ongeldige login" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "2h" });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Serverfout bij login" });
  }
});

export default router;
