/**
 * Script for generating synthetic data.
 *
 * Canonical Dataset (Source of Truth)
 *
 * Users       - Independent
 * Products    - Independent
 * Orders      - Depends on User
 * Order Items - Depends on Order & Product
 *
 * Output:
 * data/
 *  ├── users.json
 *  ├── users.csv
 *  ├── products.json
 *  ├── products.csv
 *  ├── orders.json
 *  ├── orders.csv
 *  ├── order_items.json
 *  └── order_items.csv
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { Parser } from "@json2csv/plainjs";

faker.seed(42);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// ---------------- CONFIG ----------------

const NUM_USERS = 10_000;
const NUM_PRODUCTS = 1_000;

const MIN_ORDERS = 1;
const MAX_ORDERS = 10;

const MIN_ITEMS = 1;
const MAX_ITEMS = 5;

// ---------------- DATA ----------------

const users = [];
const products = [];
const orders = [];
const orderItems = [];

const statuses = [
    "pending",
    "paid",
    "shipped",
    "delivered",
    "cancelled",
];

// ---------------- USERS ----------------

for (let i = 0; i < NUM_USERS; i++) {
    const first = faker.person.firstName().toLowerCase();
    const last = faker.person.lastName().toLowerCase();

    users.push({
        id: uuid(),
        email: `${first}.${last}.${i}@gmail.com`,
        created_at: faker.date.past({ years: 2 }),
    });
}

// ---------------- PRODUCTS ----------------

for (let i = 0; i < NUM_PRODUCTS; i++) {
    products.push({
        id: uuid(),
        sku: `SKU-${100000 + i}`,
        name: faker.commerce.productName(),
        price: Number(
            faker.commerce.price({
                min: 10,
                max: 2000,
            })
        ),
        stock_quantity: faker.number.int({
            min: 0,
            max: 500,
        }),
    });
}

// ---------------- ORDERS + ORDER ITEMS ----------------

for (const user of users) {
    const orderCount = faker.number.int({
        min: MIN_ORDERS,
        max: MAX_ORDERS,
    });

    for (let i = 0; i < orderCount; i++) {
        const orderId = uuid();

        const createdAt = faker.date.between({
            from: user.created_at,
            to: new Date(),
        });

        orders.push({
            id: orderId,
            user_id: user.id,
            status: faker.helpers.arrayElement(statuses),
            created_at: createdAt,
        });

        const itemCount = faker.number.int({
            min: MIN_ITEMS,
            max: MAX_ITEMS,
        });

        const chosenProducts = faker.helpers.arrayElements(
            products,
            itemCount
        );

        for (const product of chosenProducts) {
            orderItems.push({
                id: uuid(),
                order_id: orderId,
                product_id: product.id,
                quantity: faker.number.int({
                    min: 1,
                    max: 5,
                }),
                price_per_unit: product.price,
            });
        }
    }
}

// ---------------- WRITE HELPERS ----------------

const parser = new Parser();

function writeJsonAndCsv(filename, data) {
    // JSON
    fs.writeFileSync(
        path.join(DATA_DIR, `${filename}.json`),
        JSON.stringify(data, null, 2)
    );

    // NEW parser every time
    const parser = new Parser();

    const csv = parser.parse(data);

    fs.writeFileSync(
        path.join(DATA_DIR, `${filename}.csv`),
        csv
    );
}

// ---------------- WRITE FILES ----------------

writeJsonAndCsv("users", users);
writeJsonAndCsv("products", products);
writeJsonAndCsv("orders", orders);
writeJsonAndCsv("order_items", orderItems);

// ---------------- SUMMARY ----------------

console.log("====================================");
console.log("Synthetic Dataset Generated");
console.log("====================================");
console.log(`Users       : ${users.length}`);
console.log(`Products    : ${products.length}`);
console.log(`Orders      : ${orders.length}`);
console.log(`Order Items : ${orderItems.length}`);
console.log(`Output      : ${DATA_DIR}`);
console.log("====================================");