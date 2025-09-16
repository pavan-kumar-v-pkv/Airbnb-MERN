const Home = require('./models/home');

// Test getAllHomes
Home.getAllHomes()
    .then(([homes, fields]) => {
        console.log('Test results:');
        console.log('Number of homes:', homes.length);
        console.log('First home:', homes[0]);
        console.log('Field info:', fields);
    })
    .catch(err => {
        console.error('Error testing getAllHomes:', err);
    });