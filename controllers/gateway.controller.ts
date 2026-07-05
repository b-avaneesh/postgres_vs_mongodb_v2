import type{ Request, Response } from "express";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const PRIMARY_SERVER =
    process.env.PRIMARY_SERVER ??
    "http://localhost:6000";

export const gatewayController = async (
    req: Request,
    res: Response
) => {
    try {
        console.log("PRIMARY_SERVER =", PRIMARY_SERVER);
        console.log("Method =", req.method);
        console.log("Original URL =", req.originalUrl);
        console.log("Forwarding to =", `${PRIMARY_SERVER}${req.originalUrl}`);
        
        const response = await axios({
            method: req.method as any,

            url: `${PRIMARY_SERVER}${req.originalUrl}`,

            headers: {
                "Content-Type": "application/json",
            },

            params: req.query,

            data: req.body,
        });

        return res.status(response.status).json(response.data);
    } catch (err: any) {
        console.error(err);

        if (err.response) {
            return res
                .status(err.response.status)
                .json(err.response.data);
        }

        return res.status(500).json({
            message: "Gateway Error",
        });
    }
};