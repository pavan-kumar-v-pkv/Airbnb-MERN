// core modules
const path = require('path');
// external modules
const express = require('express');
// local modules
const storeRouter = require('./routes/storeRouter');
const hostRouter = require('./routes/hostRouter');
const rootDir = require('./utils/pathUtil');
const errorsController = require('./controllers/errors');
const { mongoConnect } = require('./utils/databaseUtil');

const app = express();

// Logging middleware - place before routes
app.use("/", (req, res, next) => {
    console.log("Request received:", req.method, req.url);
    next();
});

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views')); 

// Middleware
app.use(express.static(path.join(rootDir, 'public'))); 
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use(storeRouter);
app.use("/host", hostRouter);

// handling 404 - page not found
app.use(errorsController.pageNotFound);

// Start server after checking database connection
const port = 3000;
mongoConnect(client =>{
    console.log("Connected to MongoDB", client);
    app.listen(port, () => {
        console.log(`Server is running on address http://localhost:${port}`);
    });
})
