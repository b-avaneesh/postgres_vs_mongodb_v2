import type{ Request, Response } from "express";
import { pool } from "../config/db.js";

export const createProduct = async (req: Request, res: Response) => {
    try {
        const {
            id,
            sku,
            name,
            price,
            stock_quantity,
        } = req.body;

        if (
            !id ||
            !sku ||
            !name ||
            price == null ||
            stock_quantity == null
        ) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        const { rows } = await pool.query(
            `
            INSERT INTO products(
                id,
                sku,
                name,
                price,
                stock_quantity
            )
            VALUES($1,$2,$3,$4,$5)
            RETURNING *;
            `,
            [id, sku, name, price, stock_quantity]
        );

        return res.status(201).json(rows[0]);
    } catch (err: any) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(409).json({
                message: "Product already exists",
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { rows } = await pool.query(
            `
            SELECT *
            FROM products
            WHERE id=$1;
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.json(rows[0]);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};