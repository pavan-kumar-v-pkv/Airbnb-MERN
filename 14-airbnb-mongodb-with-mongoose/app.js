// Core Module
const path = require('path');

// External Module
const express = require('express');
const cookieParser = require('cookie-parser');

//Local Module
const authRouter = require("./routes/authRouter")
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/user');
const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const MONGO_URL = "mongodb+srv://pkvstarscream:Pkv2509%402002@cluster0.l18vnyh.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster0";
const store = new MongoDBStore({
  uri: MONGO_URL,
  collection:'sessions'
});

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "my secret key",
  resave: false,
  saveUninitialized: true,
  store: store
}))
// app.use(cookieParser());
app.use((req, res, next) => {
  // initalize req.isLoggedIn based on session
  req.isLoggedIn = req.session?.isLoggedIn || false;
  
  // If user is logged in, fetch user data
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then(user => {
        if (user) {
          req.user = user;
        }
        next();
      })
      .catch(err => {
        console.error('Error fetching user:', err);
        next();
      });
  } else {
    next();
  }
});

// Add user to all views
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.isLoggedIn;
  res.locals.user = req.user || null;
  next();
});

app.use(authRouter);
app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if(req.isLoggedIn){
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);

app.use(express.static(path.join(rootDir, 'public')))

app.use(errorsController.pageNotFound);

const PORT = 3000;
mongoose.connect(MONGO_URL)
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.log("Error connecting to MongoDB", err);
})