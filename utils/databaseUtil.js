const mysql = require("mysql2");
const fs = require('fs');
const path = require('path');

// Simple error handling for config file
let mysqlConfig;
try {
    const configPath = path.join(__dirname, '..', 'config', 'database.json');
    const config = JSON.parse(fs.readFileSync(configPath));
    mysqlConfig = config.mysql;
} catch (error) {
    console.error('Error loading database config, using defaults:', error.message);
    // Fallback configuration
    mysqlConfig = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'airbnb',
        connectionLimit: 10
    };
}

// Create the connection pool
const pool = mysql.createPool({
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    user: mysqlConfig.user,
    password: mysqlConfig.password,
    database: mysqlConfig.database,
    waitForConnections: true,
    connectionLimit: mysqlConfig.connectionLimit || 10,
    queueLimit: 0
});

// Export the promise-based pool
module.exports = pool.promise();
