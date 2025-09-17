const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/databaseUtil');

module.exports = class Favourite {
    static async addToFavourites(homeId) {
        try {
            const db = getDb();
            const favourites = await this.getFavourites();
            
            // Check if the homeId is already in favourites
            if (favourites.some(id => id.toString() === homeId.toString())) {
                console.log("Home already in favourites");
                return Promise.resolve(); // No change needed
            } 
            
            // Validate ObjectId format
            if (!ObjectId.isValid(homeId)) {
                return Promise.reject(new Error("Invalid home ID format"));
            }
            
            // Add to favourites collection
            return db.collection('favourites').insertOne({ homeId: new ObjectId(String(homeId)) });
        } catch (error) {
            console.error("Error adding to favourites:", error);
            return Promise.reject(error);
        }
    }

    static async getFavourites() {
        try {
            const db = getDb();
            const favouritesData = await db.collection('favourites').find().toArray();
            return favouritesData.map(favourite => favourite.homeId);
        } catch (error) {
            console.error('Error reading favourites:', error);
            return [];
        }
    }

    static async removeFavourite(homeId) {
        try {
            const db = getDb();
            
            // Validate ObjectId format
            if (!ObjectId.isValid(homeId)) {
                return Promise.reject(new Error("Invalid home ID format"));
            }
            
            return db.collection('favourites').deleteOne({ homeId: new ObjectId(homeId) });
        } catch (error) {
            console.error("Error removing from favourites:", error);
            return Promise.reject(error);
        }
    }

    static async deleteById(delHomeId) {
        try {
            const db = getDb();
            
            // Validate ObjectId format
            if (!ObjectId.isValid(delHomeId)) {
                return Promise.reject(new Error("Invalid home ID format"));
            }
            
            return db.collection('favourites').deleteOne({ homeId: new ObjectId(delHomeId) });
        } catch (error) {
            console.error("Error deleting from favourites:", error);
            return Promise.reject(error);
        }
    }
}