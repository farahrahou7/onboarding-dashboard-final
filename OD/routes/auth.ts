import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase, ObjectId } from "../database";
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await connectToDatabase();
    const existing = await db.collection("users").findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Gebruiker bestaat al" });

    const hashed = await bcrypt.hash(password, 10);
    const result = await db
      .collection("users")
      .insertOne({ email, password: hashed });
    res
      .status(201)
      .json({ message: "Account aangemaakt", userId: result.insertedId });
  } catch {
    res.status(500).json({ message: "Server fout bij registratie" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Gebruiker niet gevonden" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Wachtwoord incorrect" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string
    );
    res.json({ token, userId: user._id });
  } catch {
    res.status(500).json({ message: "Server fout bij login" });
  }
});

export default router;
