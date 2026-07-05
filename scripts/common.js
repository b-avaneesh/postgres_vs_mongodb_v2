//import { faker } from "@faker-js/faker";

export const BASE_URL = "http://localhost:5000"; // Gateway

export const USERS = [
    "abb5fbf9-7189-43f5-8601-2a0e5edf6db9",
    "caf87216-c8a7-4d5a-996f-9fc7ffc2ac8a",
    "5bc0ff8c-6beb-4760-ae11-5821e7b0b177",
    "cb05432c-91d0-4017-ad6c-cef42a4d3f8e",
    "ba04c787-dddc-4a03-8f1f-0f24316f7da5"
];

export const PRODUCTS = [
    "720b6d57-15d7-42d2-b227-fbf943fead7f",
    "09dd0dfb-1aee-4d7e-91be-cf5907e9f577",
    "cce30c3c-7d35-4ad9-83aa-d4dbff5cecb7",
    "81e4ae4f-307c-4869-806a-40917352b808",
    "bd045c4a-cb36-4a78-a659-c84584e85f0f",
    "95ae20b5-789f-4774-a84e-a4efd76ac3b5",
    "c138cee7-444c-4ced-9fc5-bd0f815ca228",
    "0d4bdc00-6f8b-44c7-867e-bc1a7a47b52b"
];

export function randomUser() {
    return USERS[Math.floor(Math.random() * USERS.length)];
}

export function randomProduct() {
    return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
}

// import crypto from "k6/crypto";

export function uuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = Math.floor(Math.random() * 16);
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}