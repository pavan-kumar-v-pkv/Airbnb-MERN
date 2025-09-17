const { getDb } = require('../utils/databaseUtil');
module.exports = class Home {
    constructor(title, description, price, location, bedrooms, bathrooms, amenities) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.location = location;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.amenities = amenities;
        // Don't set ID here - only set it when we need to create a new record
    }

    save() {
        const db = getDb();
        return db.collection("homes").insertOne(this);
    }

    static getAllHomes() {
        
    }

    static getHomeById(homeId) {
        
    }

    static deleteById(homeId) {
        
    }
};