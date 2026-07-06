import { ObjectId } from "mongodb";

export interface OrderItem {
    productId: ObjectId;

    quantity: number;

    pricePerUnit: number;
}

export interface Order {
    _id?: ObjectId;

    userId: ObjectId;

    status: "Pending" | "Completed" | "Cancelled";

    createdAt: Date;

    items: OrderItem[];
}