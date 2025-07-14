// database.ts – using MongoDB Node.js Driver
import { MongoClient, Db, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI as string;
const client = new MongoClient(uri);

let db: Db;
async function connectToDatabase(): Promise<Db> {
  // Connect to MongoDB (if not already connected)
  if (!db) {
    await client.connect();
    db = client.db("onboarding"); // Explicitly use the "onboarding" database
  }
  return db;
}

export { connectToDatabase, ObjectId, client };
