const mysql = require('mysql2');

// Create a basic connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '', // Empty password since MySQL may be running with --skip-grant-tables
    database: 'airbnb'
});

// Attempt to connect
console.log('Attempting to connect to MySQL...');
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:');
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        console.error('Connection details:', {
            host: 'localhost',
            port: 3306,
            user: 'root',
            database: 'airbnb'
        });
        
        // Try another approach
        console.log('\nTrying alternative connection approach...');
        const altConnection = mysql.createConnection({
            socketPath: '/tmp/mysql.sock',
            user: 'root',
            password: '',
            database: 'airbnb'
        });
        
        altConnection.connect((altErr) => {
            if (altErr) {
                console.error('Alternative connection also failed:');
                console.error('Error code:', altErr.code);
                console.error('Error message:', altErr.message);
                return;
            }
            
            console.log('Connected to MySQL via socket successfully!');
            // Run a simple test query
            altConnection.query('SHOW DATABASES', (err, results) => {
                console.log('Available databases:', results.map(row => row.Database).join(', '));
                altConnection.end();
            });
        });
        
        return;
    }
    
    console.log('Connected to MySQL successfully!');
    
    // Run a simple test query
    connection.query('SHOW DATABASES', (err, results) => {
        if (err) {
            console.error('Error running query:', err);
            return;
        }
        
        console.log('Available databases:', results.map(row => row.Database).join(', '));
        
        // Check if airbnb database exists
        if (results.some(row => row.Database === 'airbnb')) {
            console.log('Airbnb database exists, checking tables...');
            connection.query('SHOW TABLES FROM airbnb', (err, tables) => {
                if (err) {
                    console.error('Error querying tables:', err);
                } else {
                    console.log('Tables in airbnb database:', tables.length > 0 ? 
                        tables.map(row => Object.values(row)[0]).join(', ') : 
                        'No tables found');
                }
                connection.end();
            });
        } else {
            console.log('Airbnb database does not exist, need to create it');
            connection.end();
        }
    });
});