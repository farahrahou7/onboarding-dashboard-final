import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("onboarding");
  const collection = db.collection("notes");

  if (req.method === "GET") {
    const notes = await collection.find({}).toArray();
    res.json(notes);
  } else if (req.method === "POST") {
    const note = req.body;
    await collection.insertOne(note);
    res.status(201).json({ message: "Note added" });
  }
}