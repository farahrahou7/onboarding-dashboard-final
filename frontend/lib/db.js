import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Voeg MONGODB_URI toe aan je .env bestand");
}

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;
