import { faker } from "@faker-js/faker";
import path from "path";
import fs from 'fs';
import csv from "csv-parser";


function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", reject);
    });
}

const ORDERS_DIR = path.join("../","data","orders.csv");
const ORDER_ITEMS = path.join("../","data","order_items.csv");

const orders = await readCSV(ORDERS_DIR);
const order_items = await readCSV(ORDER_ITEMS);



function migration(){
    console.log("Starting process")
    const mongoFinalOrders = [];
    for (const o of orders){
        const id = o.id;
        const items = [];
        for(const oi of order_items){
            if(id === oi.order_id){
                /**
                 * Rewrite into items.
                 * id: id
                 * items:[
                 *  {
                 *  product_id:
                 *  quantity:
                 *  }
                 * ]
                 * 
                 */
            
            items.push({
                product_id: oi.product_id,
                quantity:Number(oi.quantity),
                price_per_unit:Number(oi.price_per_unit)
            })
            }
        }
        mongoFinalOrders.push({
            items:items,
            id:id,
            user_id:o.user_id,
            status:o.status,
            created_at:new Date(o.created_at)
        }) 
    }
    console.log("Writing to file");
    fs.writeFileSync(
        path.join("../", "data", "mongo_orders.json"),
        JSON.stringify(mongoFinalOrders, null, 2)
    );

}


migration();