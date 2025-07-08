import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI as string;
const client = new MongoClient(uri);

let db: Db;
let clientPromise: Promise<Db>;

if (!global._mongoDbPromise) {
  clientPromise = client.connect().then((client) => {
    db = client.db("onboarding"); // ✅ hier kiezen we expliciet de juiste database
    return db;
  });
  global._mongoDbPromise = clientPromise;
} else {
  clientPromise = global._mongoDbPromise;
}

export default clientPromise;

// Typing workaround for Node global
declare global {
  var _mongoDbPromise: Promise<Db> | undefined;
}
