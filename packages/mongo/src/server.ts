import express from "express";
import dotenv from "dotenv";
import {connectMongo} from "../config/db.js";
import { MongoClient, Db } from "mongodb";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 6000;

app.listen(PORT, async () => {
    console.log(`MongoDB Server running on port ${PORT}`);
    await connectMongo();
});