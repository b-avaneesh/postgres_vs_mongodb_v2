import express from "express";
import dotenv from "dotenv";
import { pool } from "../config/db.js";
import router from "../routes/routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(router);
const PORT = process.env.PORT || 4000;
const TEST = process.env.TEST;

app.listen(PORT,async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("Connected to PostgreSQL");
        console.log(result.rows[0]);
    } catch (err) {
        console.error("Database connection failed:", err);
    }
});