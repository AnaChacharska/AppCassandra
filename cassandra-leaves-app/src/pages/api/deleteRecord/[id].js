import { MongoClient, ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method === "DELETE") {
        const { id } = req.query;
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const database = client.db("your-database");
        const collection = database.collection("useful_data");

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        client.close();

        res.status(200).json(result);
    } else {
        res.status(405).end();
    }
}