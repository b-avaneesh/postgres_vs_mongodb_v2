import type{ Request, Response } from "express";
import { pool } from "../config/db.js";

export const createOrder = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const {
            id,
            user_id,
            status,
            created_at,
            items,
        } = req.body;

        await client.query("BEGIN");

        await client.query(
            `
            INSERT INTO orders(
                id,
                user_id,
                status,
                created_at
            )
            VALUES($1,$2,$3,$4);
            `,
            [
                id,
                user_id,
                status,
                created_at,
            ]
        );

        for (const item of items) {
            const product = await client.query(
                `
                SELECT price
                FROM products
                WHERE id=$1;
                `,
                [item.product_id]
            );

            if (product.rows.length === 0) {
                throw new Error("Product not found");
            }
            if (item.quantity <= 0) {
            throw new Error("Quantity must be greater than 0.");
            }

            if (product.rows[0].stock_quantity < item.quantity) {
                throw new Error(
                    `Insufficient stock for product ${item.product_id}.`
                );
            }
            await client.query(
                `
                INSERT INTO order_items(
                    id,
                    order_id,
                    product_id,
                    quantity,
                    price_per_unit
                )
                VALUES($1,$2,$3,$4,$5);
                `,
                [
                    item.id,
                    id,
                    item.product_id,
                    item.quantity,
                    product.rows[0].price,
                ]
            );
            /**
             * Updating inventory!
             */
            await client.query(
            `
            UPDATE products
            SET stock_quantity = stock_quantity - $1
            WHERE id = $2;
            `,
            [item.quantity, item.product_id]
            );
        }
        
        await client.query("COMMIT");

        return res.status(201).json({
            message: "Order created",
        });
    } catch (err) {
        await client.query("ROLLBACK");

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    } finally {
        client.release();
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const order = await pool.query(
            `
            SELECT *
            FROM orders
            WHERE id=$1;
            `,
            [id]
        );

        if (order.rows.length === 0) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        const items = await pool.query(
            `
            SELECT
                oi.product_id,
                p.name AS product_name,
                oi.quantity,
                oi.price_per_unit

            FROM order_items oi

            JOIN products p
                ON p.id=oi.product_id

            WHERE oi.order_id=$1;
            `,
            [id]
        );

        return res.json({
            ...order.rows[0],
            items: items.rows,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};


export const updateOrderStatus = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { rows } = await pool.query(
            `
            UPDATE orders
            SET status=$1
            WHERE id=$2
            RETURNING *;
            `,
            [status, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Order not found",
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


export const deleteOrder = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM orders
            WHERE id=$1;
            `,
            [id]
        );
        /**
         * Need to delete from order-items as well.
         */

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        return res.json({
            message: "Order deleted",
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};