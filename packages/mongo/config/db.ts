import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI!;

const client = new MongoClient(uri);

export async function connectMongo() {
    await client.connect();
    console.log("MongoDB Connected");
    return client.db("pg_mongo_v2");
}

export default client;