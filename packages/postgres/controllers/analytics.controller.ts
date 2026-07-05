import type{ Request, Response } from "express";
import { pool } from "../config/db.js";


export const getRevenue = async (
    req: Request,
    res: Response
) => {
    try {
        const { rows } = await pool.query(
            `
            SELECT
                COALESCE(
                    SUM(quantity * price_per_unit),
                    0
                ) AS revenue
            FROM order_items;
            `
        );

        return res.json(rows[0]);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const getTopProducts = async (
    req: Request,
    res: Response
) => {
    try {
        const { rows } = await pool.query(
            `
            SELECT
                p.id,
                p.sku,
                p.name,
                SUM(oi.quantity) AS total_sold

            FROM products p

            JOIN order_items oi
                ON oi.product_id=p.id

            GROUP BY
                p.id,
                p.sku,
                p.name

            ORDER BY total_sold DESC

            LIMIT 10;
            `
        );

        return res.json(rows);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};