Postgres:

+---------------+        +---------------+        +------------------+        +---------------+
  |     users     |        |    orders     |        |   order_items    |        |   products    |
  +---------------+        +---------------+        +------------------+        +---------------+
  | id (PK)       |<-------| user_id (FK)  |        | id (PK)          |        | id (PK)       |
  | email         |        | id (PK)       |<-------| order_id (FK)    |        | sku           |
  | created_at    |        | total_amount  |        | product_id (FK)  |------->| name          |
  +---------------+        | status        |        | quantity         |        | price         |
                           | created_at    |        | price_per_unit   |        | stock_quantity|
                           +---------------+        +------------------+        +---------------+

MongoDB:
users Collection: Holds flat user profile documents.
orders Collection: Each document contains an array of item sub-documents.
products Collection: Inventory of products with nos available.
