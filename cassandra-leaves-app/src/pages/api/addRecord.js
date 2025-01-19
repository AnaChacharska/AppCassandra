import { MongoClient } from "mongodb";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import dotenv from 'dotenv';
export default async function handler(req, res) {
    if (req.method === "POST") {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const database = client.db("your-database");
        const collection = database.collection("useful_data");

        const newRecord = req.body;
        const result = await collection.insertOne(newRecord);
        client.close();

        res.status(200).json(result);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}