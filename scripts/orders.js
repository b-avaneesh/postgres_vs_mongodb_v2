import http from "k6/http";
import { check } from "k6";

import {
    BASE_URL,
    randomUser,
    randomProduct,
    uuid,
} from "./common.js";

export const options = {
    vus: 20,
    duration: "30s",
    thresholds: {
    http_req_duration: [
        "p(95)<500", // Generally P95 should be less than 500ms
    ],

    http_req_failed: [
        "rate<0.01", 
    ],
    }
};

const ORDER_STATUS = [
    "pending",
    "paid",
    "shipped",
    "delivered",
    "cancelled",
];

export default function () {

    const itemCount = Math.floor(Math.random() * 4) + 1;

    const usedProducts = new Set();

    const items = [];

    while (items.length < itemCount) {

        const product = randomProduct();

        if (usedProducts.has(product)) {
            continue;
        }

        usedProducts.add(product);

        items.push({
            id: uuid(),
            product_id: product,
            quantity: Math.floor(Math.random() * 5) + 1,
        });
    }

    const payload = {
        id: uuid(),

        user_id: randomUser(),

        status:
            ORDER_STATUS[
                Math.floor(Math.random() * ORDER_STATUS.length)
            ],

        created_at: new Date().toISOString(),

        items,
    };

    const response = http.post(
        `${BASE_URL}/orders`,
        JSON.stringify(payload),
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    check(response, {
        "Order Created": (r) => r.status === 201,
    });
}