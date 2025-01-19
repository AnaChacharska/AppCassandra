import { MongoClient } from "mongodb";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    const { id } = req.query;

    if (!id) {
        res.status(400).json({ error: "ID is required" });
        return;
    }

    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const database = client.db("your-database");
        const collection = database.collection("useful_data");

        const record = await collection.findOne({ id });

        if (!record) {
            res.status(404).json({ error: "Record not found" });
            return;
        }

        client.close();
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from MongoDB" });
    }
}