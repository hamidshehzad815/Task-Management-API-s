USE sql_store;

SELECT * FROM products;

SELECT * FROM customers;

SELECT * FROM products WHERE quantity_in_stock in (49, 38, 72)

SELECT *
FROM customers
WHERE
    birth_date BETWEEN '1990-01-01' AND '2000-01-01'

SELECT *
FROM customers
WHERE
    first_name LIKE '%b%'
    OR first_name LIKE '%e_';

SELECT *
FROM customers
WHERE
    last_name REGEXP '^BR'
    OR last_name REGEXP 'BY$';
-- WHERE last_name REGEXP '^BR|BY$|rose';
-- WHERE first_name REGEXP '[m]e';

SELECT * FROM customers WHERE phone IS NOT NULL;

SELECT * FROM orders ORDER BY customer_id, order_id DESC;

SELECT * FROM orders;

SELECT *
FROM customers
    -- LIMIT 5;
    -- LIMIT 3, 3
ORDER BY points DESC
LIMIT 3;

SELECT order_id, first_name, last_name
FROM orders
    JOIN customers ON customers.customer_id = orders.customer_id;

SELECT order_id, p.product_id, oi.quantity, oi.unit_price
FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
ORDER BY order_id;

SELECT
    customer_id,
    first_name,
    points,
    "GOLD" as type
FROM customers
WHERE
    points > 3000
UNION
SELECT
    customer_id,
    first_name,
    points,
    "SILVER" as type
FROM customers
WHERE
    points BETWEEN 2000 and 3000
UNION
SELECT
    customer_id,
    first_name,
    points,
    "BRONZE" as type
FROM customers
WHERE
    points < 2000
ORDER BY first_name

INSERT INTO
    `Comment`
VALUES (
        DEFAULT,
        1,
        1,
        'I completed this in two week',
        DEFAULT
    )

INSERT INTO
    `Task`
VALUES (
        DEFAULT,
        'Prayer',
        'Prayer 5 times a day',
        CURDATE(),
        DEFAULT,
        DEFAULT,
        1,
        1,
        DEFAULT,
        DEFAULT
    )

INSERT INTO
    `USER`
VALUES (
        DEFAULT,
        'Hamid Shehzad',
        'hamidlilla7@gmail.com',
        'hamidpassword@442004',
        'Admin'
    );

SELECT `userId`, `taskId`, title
FROM `User` AS u
    JOIN `Task` AS t ON u.`userId` = t.`createdBy`;

SELECT * FROM `Task` ORDER BY status