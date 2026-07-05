import { Router } from "express";

import {
    createUser,
    getUserById,
    getUserOrders,
} from "../controllers/user.controller.js";

import {
    createProduct,
    getProductById,
} from "../controllers/product.controller.js";

import {
    createOrder,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
} from "../controllers/order.controller.js";

import {
    getRevenue,
    getTopProducts,
} from "../controllers/analytics.controller.js";

const router = Router();

/* =========================
   Users
========================= */

router.post("/users", createUser);
router.get("/users/:id", getUserById);
router.get("/users/:id/orders", getUserOrders);

/* =========================
   Products
========================= */

router.post("/products", createProduct);
router.get("/products/:id", getProductById);

/* =========================
   Orders
========================= */

router.post("/orders", createOrder);
router.get("/orders/:id", getOrderById);
router.patch("/orders/:id/status", updateOrderStatus);
router.delete("/orders/:id", deleteOrder);

/* =========================
   Analytics
========================= */

router.get("/analytics/revenue", getRevenue);
router.get("/analytics/top-products", getTopProducts);

export default router;