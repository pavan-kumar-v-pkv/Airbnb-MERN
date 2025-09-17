const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/databaseUtil');
module.exports = class Home {
    constructor(_id, title, description, price, location, bedrooms, bathrooms, amenities) {
        // Only convert to ObjectId if _id is provided and it's not already an ObjectId
        if(_id) {
            // Check if it's already an ObjectId instance
            if(!ObjectId.isValid(_id)) {
                try {
                    this._id = new ObjectId(String(_id));
                } catch (error) {
                    console.error("Invalid ObjectId format:", error);
                    // Use a string ID if conversion fails
                    this._id = _id;
                }
            } else {
                this._id = new ObjectId(String(_id));
            }
        }
        this.title = title;
        this.description = description;
        this.price = price;
        this.location = location;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.amenities = amenities;
    }

    save() {
        const db = getDb();
        let dbOp;
        
        if (this._id) {
            // Update existing home
            dbOp = db.collection("homes").updateOne(
                { _id: this._id },
                { $set: this }
            );
        } else {
            // Insert new home (let MongoDB generate the _id)
            dbOp = db.collection("homes").insertOne(this);
        }
        
        return dbOp;
    }

    static getAllHomes() {
        const db = getDb();
        return db.collection("homes").find().toArray();
    }

    static getHomeById(homeId) {
        const db = getDb();
        try {
            // Check if valid ObjectId format before converting
            if (!ObjectId.isValid(homeId)) {
                return Promise.reject(new Error("Invalid home ID format"));
            }
            return db.collection("homes")
                .findOne({ _id: new ObjectId(String(homeId)) });
        } catch (error) {
            console.error("Error getting home by ID:", error);
            return Promise.reject(new Error("Invalid home ID format"));
        }
    }

    static deleteById(homeId) {
        const db = getDb();
        try {
            // Check if valid ObjectId format before converting
            if (!ObjectId.isValid(homeId)) {
                return Promise.reject(new Error("Invalid home ID format"));
            }
            return db.collection("homes")
                .deleteOne({ _id: new ObjectId(homeId) });
        } catch (error) {
            console.error("Error deleting home:", error);
            return Promise.reject(new Error("Invalid home ID format"));
        }
    }
};