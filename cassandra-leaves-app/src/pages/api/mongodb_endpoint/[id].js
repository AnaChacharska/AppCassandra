import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default async (req, res) => {
    const { id } = req.query;

    try {
        console.log('Mongo URI:', process.env.MONGODB_URI);
        console.log('Connecting to MongoDB...');
        const client = await clientPromise;
        console.log('Connected to MongoDB.');

        const db = client.db('your-database');
        console.log('Selected Database: your-database');

        const collection = db.collection('useful_data');
        console.log('Selected Collection: useful_data');

        console.log('ID received:', id, 'Is ObjectId valid:', ObjectId.isValid(id));

        let query;
        if (ObjectId.isValid(id)) {
            query = { _id: new ObjectId(id) };
        } else {
            query = { _id: id }; // In case _id is stored as a string
        }
        console.log('Constructed Query:', query);

        const record = await collection.findOne(query);
        console.log('Query Result:', record);

        if (!record) {
            console.log('Record not found.');
            res.status(404).json({ message: 'Record not found' });
            return;
        }

        console.log('Record found:', record);
        res.status(200).json(record);
    } catch (error) {
        console.error('Error fetching record:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
