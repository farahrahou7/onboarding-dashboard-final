import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("onboarding");
  const collection = db.collection("materials");

  if (req.method === "GET") {
    const data = await collection.find({}).toArray();
    res.json(data);
  } else if (req.method === "POST") {
    const material = req.body;
    await collection.insertOne(material);
    res.status(201).json({ message: "Material saved" });
  }
}

