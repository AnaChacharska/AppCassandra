import { MongoClient } from "mongodb";

const uri = "mongodb+srv://user:user1234*@cluster0.4l4fs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    try {
        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db("your-database");
        const collection = database.collection("useful_data");
        const data = await collection.find({}).toArray();
        await client.close();

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
        res.status(500).json({ error: "Failed to fetch data from MongoDB" });
    }
}