require("dotenv").config();
const mysql = require("mysql2/promise"); // Using promise-based API

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE, // Specify the database here
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection to the database
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to Database");
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the application if connection fails
  }
};

// Invoke the connection test
testConnection();

module.exports = pool; // Export the pool for use in your application
