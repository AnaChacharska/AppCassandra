import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://user:user1234*@cluster0.4l4fs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        console.log("Connecting to MongoDB...");
        const client = new MongoClient(uri);
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("your-database");
        const collection = database.collection("useful_data");
        console.log("Fetching data from collection...");

        const record = await collection.findOne({ _id: new ObjectId(id) });

        if (!record) {
            res.status(404).json({ error: "Record not found" });
            return;
        }

        console.log("Data fetched successfully");

        await client.close();
        console.log("MongoDB connection closed");

        res.status(200).json(record);
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
        res.status(500).json({ error: "Failed to fetch data from MongoDB" });
    }
}