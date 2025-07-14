import express from "express";
import { connectToDatabase, client } from "../database";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const db = await connectToDatabase();
    const dbName = db.databaseName;

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);

    res.json({
      connectedTo: dbName,
      collections: collectionNames,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch debug info", error: err });
  }
});

export default router;
