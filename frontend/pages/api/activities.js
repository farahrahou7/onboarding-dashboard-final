import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("onboarding");
  const collection = db.collection("activities");

  if (req.method === "GET") {
    const activities = await collection.find({}).toArray();
    res.json(activities);Add commentMore actions
  } else if (req.method === "POST") {
    const activity = req.body;
    await collection.insertOne(activity);
    res.status(201).json({ message: "Activity saved" });
  }
}

