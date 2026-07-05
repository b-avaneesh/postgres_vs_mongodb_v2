import type { Request, Response } from "express";
import { pool } from "../config/db.js";

/*
POST /users

Body:
{
    "email":"abc@gmail.com",
    "id":uuid
}
*/
export const createUser = async (req: Request, res: Response) => {
    try {
        const { id, email, created_at } = req.body;

        if (!id || !email || !created_at) {
            return res.status(400).json({
                message: "id, email and created_at are required."
            });
        }

        const { rows } = await pool.query(
            `
            INSERT INTO users(
                id,
                email,
                created_at
            )
            VALUES($1,$2,$3)
            RETURNING id,email,created_at;
            `,
            [id, email, created_at]
        );

        return res.status(201).json(rows[0]);
    } catch (err: any) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

/*
GET /users/:id
*/
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { rows } = await pool.query(
            `
            SELECT
                id,
                email,
                created_at
            FROM users
            WHERE id=$1;
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.json(rows[0]);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

/*
GET /users/:id/orders
*/
export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { rows } = await pool.query(
            `
            SELECT
                o.id AS order_id,
                o.status,
                o.created_at,

                oi.product_id,
                p.name AS product_name,
                oi.quantity,
                oi.price_per_unit,

                SUM(oi.quantity * oi.price_per_unit)
                    OVER (PARTITION BY o.id) AS total_amount

            FROM orders o

            LEFT JOIN order_items oi
                ON oi.order_id=o.id

            LEFT JOIN products p
                ON p.id=oi.product_id

            WHERE o.user_id=$1

            ORDER BY o.created_at DESC;
            `,
            [id]
        );

        const orders = new Map();

        for (const row of rows) {
            if (!orders.has(row.order_id)) {
                orders.set(row.order_id, {
                    id: row.order_id,
                    status: row.status,
                    created_at: row.created_at,
                    total_amount: Number(row.total_amount),
                    items: [],
                });
            }

            orders.get(row.order_id).items.push({
                product_id: row.product_id,
                product_name: row.product_name,
                quantity: row.quantity,
                price_per_unit: Number(row.price_per_unit),
            });
        }

        return res.json([...orders.values()]);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};