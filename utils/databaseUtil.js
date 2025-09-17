const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const MONGO_URL = "mongodb+srv://pkvstarscream:Pkv2509%402002@cluster0.l18vnyh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(MONGO_URL).then(client => {
        _db = client.db("airbnb");
        callback(client);
    }).catch(err => {
        console.log("Error connecting to MongoDB", err);
        throw err;
    });
}

const getDb = () => {
    if (!_db) {
        throw new Error("Mongo not connected or No database found!");
    }
    return _db;
};

module.exports = {
    mongoConnect,
    getDb
};