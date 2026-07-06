
# PostgreSQL vs MongoDB Performance Benchmark

A comparative benchmarking project evaluating the performance of **PostgreSQL** and **MongoDB** under identical workloads. The project implements the same REST API using both databases and measures their behavior under concurrent load using industry-standard monitoring and load-testing tools.

> **Objective:** Compare latency, throughput, resource utilization, and scalability of relational and document databases using a consistent application layer.

---

# Project Overview

Two independent backend implementations expose identical REST endpoints:

* **PostgreSQL Backend**
* **MongoDB Backend**

Both services implement the same business logic, allowing performance differences to be attributed primarily to the underlying database.

Performance metrics are collected using **Prometheus**, visualized in **Grafana**, and stress-tested with **k6**.

---

# Features

## PostgreSQL

* User CRUD operations
* Product CRUD operations
* Order CRUD operations
* Transaction support
* Indexed queries
* Revenue aggregation

## MongoDB

* User CRUD operations
* Product CRUD operations
* Order CRUD operations
* Aggregation pipeline
* Indexed collections
* Revenue aggregation

---

# Benchmarking Stack

| Tool       | Purpose               |
| ---------- | --------------------- |
| Node.js    | Backend runtime       |
| Express.js | REST API              |
| PostgreSQL | Relational database   |
| MongoDB    | Document database     |
| Prometheus | Metrics collection    |
| Grafana    | Metrics visualization |
| k6         | Load testing          |

---

# Architecture

```text
                 k6 Load Generator
                        │
                        ▼
                 Express REST API
                  /            \
                 /              \
      PostgreSQL Backend    MongoDB Backend
             │                    │
             ▼                    ▼
       PostgreSQL DB         MongoDB
             │                    │
             └────────────┬────────────┘
                          ▼
                    Prometheus
                          │
                          ▼
                       Grafana
```

---

# API Modules

The benchmark implements three core entities.

## Users

* Create user
* Retrieve user
* List user orders

## Products

* Create product
* Retrieve product

## Orders

* Create order
* Retrieve order
* Update order status
* Delete order
* Revenue aggregation

Both database implementations expose identical endpoints.

---

# Metrics Collected

The benchmark evaluates:

* Request latency
* Requests per second (Throughput)
* Error rate
* Average response time
* 95th percentile latency
* CPU utilization
* Memory utilization
* Database query performance

---

# Load Testing

Load testing is performed using **k6**.

Typical scenarios include:

* Constant Virtual Users
* Ramp-up testing
* Stress testing
* Peak load testing

The same workload is executed against both implementations to ensure fair comparison.

---

# Monitoring

## Prometheus

Prometheus periodically scrapes metrics exposed by the application and database exporters.

Collected metrics include:

* HTTP request duration
* Request count
* CPU usage
* Memory usage
* PostgreSQL exporter metrics
* MongoDB exporter metrics

---

## Grafana

Grafana dashboards visualize:

* API latency
* Request throughput
* Database performance
* Resource utilization
* Error rates

---

# Repository Structure

```text
.
├── postgres/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── server.js
│
├── mongodb/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── server.js
│
├── k6/
│   ├── benchmark.js
│   └── scenarios/
│
├── prometheus/
│
├── grafana/
│
└── README.md
```

---

# Running the Project

Install dependencies:

```bash
npm install
```

Start the PostgreSQL backend:

```bash
npm run postgres
```

Start the MongoDB backend:

```bash
npm run mongodb
```

Run Prometheus:

```bash
prometheus
```

Run Grafana:

```bash
grafana-server
```

Execute load tests:

```bash
k6 run k6/benchmark.js
```
----
# Benchmark Findings

## V1: Initial Benchmark (MongoDB ORM vs PostgreSQL Native)

The first benchmark compared a MongoDB implementation using an ORM against a PostgreSQL implementation using native SQL queries under a mixed workload.

### Test Configuration

* **Concurrent Users:** 50 virtual users
* **Dataset:**

  * 5,000 Users
  * ~20,000 Orders
  * ~15,000 Products
  * ~15,000 Additional transactional records
* **Workload:**

  * CRUD operations
  * Complex joins
  * Aggregation queries
  * Transaction processing
* **Metrics Collected:**

  * Throughput (requests/sec)
  * Average latency
  * P95/P99 latency
  * Event loop lag
  * Consistency validation

### Results

| Metric          | MongoDB          | PostgreSQL   | Observation                                                       |
| --------------- | ---------------- | ------------ | ----------------------------------------------------------------- |
| Throughput      | ~14–15 req/s     | ~10–11 req/s | MongoDB handled approximately **35% higher throughput**.          |
| Average Latency | ~500–550 ms      | ~100–120 ms  | PostgreSQL responded roughly **4–5× faster** on average.          |
| P95 Latency     | Peaks up to ~5 s | Below ~1 s   | PostgreSQL maintained significantly more consistent tail latency. |
| Event Loop Lag  | ~0.0035 ms       | ~0.0025 ms   | PostgreSQL exhibited approximately **28% lower event loop lag**.  |

### Observations

Although MongoDB achieved higher overall throughput, PostgreSQL consistently delivered:

* Lower average response times
* Better tail latency (P95)
* Lower event loop lag
* More predictable performance under load

One limitation of the initial benchmark was that a **single k6 script executed multiple API endpoints simultaneously**, making it difficult to attribute performance characteristics to individual database operations.

---

# V2: Native-Level Benchmark (Current Work)

The second iteration focuses on isolating database behavior by benchmarking individual operations independently.

## Objectives

* Benchmark each API operation separately.
* Eliminate workload interference between different request types.
* Produce operation-specific latency and throughput metrics.
* Improve reproducibility of benchmark results.

## Changes from V1

* Separate k6 script for every API endpoint.
* Smaller and more focused dataset.
* Cleaner benchmarking methodology.
* Easier comparison of equivalent database operations.
* Improved analysis of CRUD, aggregation, and transaction performance independently.

The goal of V2 is to provide a more accurate comparison of PostgreSQL and MongoDB at the database operation level rather than relying on aggregate workload measurements.


---

# Benchmark Goals

This project aims to compare both databases with respect to:

* Read performance
* Write performance
* Concurrent request handling
* Aggregation query performance
* Resource utilization
* Scalability under load

---

# Future Improvements

* Docker Compose deployment
* Automated benchmark pipeline
* Additional workload scenarios
* Horizontal scaling experiments
* Replication and sharding benchmarks
* Time-series benchmark reporting

---

# License

MIT
