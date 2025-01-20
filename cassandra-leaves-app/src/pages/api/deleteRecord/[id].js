import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
    if (req.method === "DELETE") {
        const { id } = req.query;
        console.log("ID received for deletion:", id);

        const client = new MongoClient(process.env.MONGODB_URI);

        try {
            await client.connect();
            console.log("Connected to MongoDB");

            const database = client.db("your-database");
            const collection = database.collection("useful_data");

            // Ensure ID is passed as a string
            const result = await collection.deleteOne({ id: String(id) });
            console.log("Delete Result:", result);

            if (result.deletedCount === 1) {
                res.status(200).json({ message: "Record deleted successfully" });
            } else {
                res.status(404).json({ error: "Record not found" });
            }
        } catch (error) {
            console.error("Error deleting record from MongoDB:", error);
            res.status(500).json({ error: "Failed to delete record from MongoDB" });
        } finally {
            await client.close(); // Ensure the connection is closed gracefully
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
