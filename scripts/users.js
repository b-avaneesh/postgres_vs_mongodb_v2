import http from "k6/http";
import { check } from "k6";
import { BASE_URL, USERS } from "./common.js";

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

    const id = USERS[Math.floor(Math.random() * USERS.length)];

    const res = http.get(
        `${BASE_URL}/users/${id}`
    );

    check(res, {
        "status is 200": (r) => r.status === 200,
    });
}