import {MongoClient, ObjectId} from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const database = client.db("your-database");
        const collection = database.collection("useful_data");

        const newRecord = { ...req.body, id: new ObjectId().toString() };
        const result = await collection.insertOne(newRecord);
        client.close();

        res.status(200).json(result);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}