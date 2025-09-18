// Core Module
const path = require('path');

// External Module
require('dotenv').config(); // Load environment variables
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
const multer = require('multer');

app.set('view engine', 'ejs');
app.set('views', 'views');

// Construct MongoDB URL from environment variables
const MONGO_USERNAME = process.env.MONGODB_USERNAME;
const MONGO_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGO_CLUSTER = process.env.MONGODB_CLUSTER;
const MONGO_DB = process.env.MONGODB_DATABASE;

const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`;
const store = new MongoDBStore({
  uri: MONGO_URL,
  collection:'sessions'
});

const randomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/png') || file.mimetype.startsWith('image/jpeg') || file.mimetype.startsWith('image/jpg')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
})
const multerOption = {
  storage: storage,
  fileFilter: fileFilter
}

app.use(express.urlencoded({ extended: true }));
app.use(multer(multerOption).single('photo'))
app.use(express.static(path.join(rootDir, 'public')))
app.use('/uploads', express.static(path.join(rootDir, 'uploads')))

app.use(session({
  secret: process.env.SESSION_SECRET || "fallback_secret_key",
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
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if(req.isLoggedIn){
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);


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