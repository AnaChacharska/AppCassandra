import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const database = client.db("your-database");
        const collection = database.collection("useful_data");

        const data = await collection.find({}).toArray();
        client.close();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from MongoDB" });
    }
}