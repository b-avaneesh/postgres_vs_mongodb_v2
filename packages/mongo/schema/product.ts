import { ObjectId } from "mongodb";

export interface Product {
    _id?: ObjectId;

    sku: string;

    name: string;

    price: number;

    stockQuantity: number;
}