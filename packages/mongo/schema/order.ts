import { ObjectId } from "mongodb";

export interface OrderItem {
    product_id: string,
    quantity:number,
    price_per_unit:number

}

export interface Orders{
    id: string,
    user_id:string,
    items: OrderItem[],
    created_at: Date,
    status:string

}