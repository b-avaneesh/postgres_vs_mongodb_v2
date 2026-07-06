import http from "k6/http";
import { check } from "k6";
import { BASE_URL } from "./common.js";

export const options = {
    vus: 20,
    duration: "30s",
    thresholds: {
    http_req_duration: [
        "p(95)<500",
    ],

    http_req_failed: [
        "rate<0.01", 
    ],
    }
};

export default function () {

    let res = http.get(
        `${BASE_URL}/analytics/revenue`
    );

    check(res, {
        revenue: (r) => r.status === 200,
    });

    res = http.get(
        `${BASE_URL}/analytics/top-products`
    );

    check(res, {
        topProducts: (r) => r.status === 200,
    });
}