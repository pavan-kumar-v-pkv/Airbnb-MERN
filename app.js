// core modules
const path = require('path');
// external modules
const express = require('express');
// local modules
const storeRouter = require('./routes/storeRouter');
const hostRouter = require('./routes/hostRouter');
const rootDir = require('./utils/pathUtil');
const errorsController = require('./controllers/errors');

const app = express();

// Debug logging
console.log('storeRouter type:', typeof storeRouter);
console.log('hostRouter type:', typeof hostRouter);
console.log('errorsController type:', typeof errorsController);

app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views')); // Setting the views directory

app.use(express.static(path.join(rootDir, 'public'))); // Serving static files from 'public' directory
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(storeRouter);
app.use("/host", hostRouter);

app.use("/", (req, res, next) => {
    console.log(req.url, req.method);
    next(); 
})

// handling 404 - page not found
app.use(errorsController.pageNotFound);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on address http://localhost:${port}`);
})