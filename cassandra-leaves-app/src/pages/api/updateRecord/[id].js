import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
    if (req.method === "PATCH") {
        const { id } = req.query;

        console.log("ID received for edit:", id);

        const client = new MongoClient(process.env.MONGODB_URI);
        try {
            await client.connect();
            const database = client.db("your-database");
            const collection = database.collection("useful_data");

            const updatedRecord = { ...req.body };
            console.log(`Updating record with id: ${id}`);
            console.log(`Updated data:`, updatedRecord);

            const result = await collection.updateOne(
                { id: String(id) },
                { $set: updatedRecord }
            );

            if (result.matchedCount === 1) {
                res.status(200).json({ message: "Record updated successfully" });
            } else {
                console.error(`Record with id ${id} not found`);
                res.status(404).json({ error: "Record not found" });
            }
        } catch (error) {
            console.error("Error updating record in MongoDB:", error);
            res.status(500).json({ error: "Failed to update record in MongoDB" });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}