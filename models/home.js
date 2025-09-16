const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/pathUtil');

const registeredHomes = []; // In-memory array to store registered homes
const homeDataPath = path.join(rootDir, 'data', 'homes.json');

module.exports = class Home {
    constructor(title, description, price, location, bedrooms, bathrooms, amenities) {
        this.id = new Date().getTime().toString(); // Generate a unique ID based on timestamp
        this.title = title;
        this.description = description;
        this.price = price;
        this.location = location;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.amenities = amenities;
    }

    save() {
        
        Home.getAllHomes(existingHomes => {
            if (this.id) { // edit existing home
                existingHomes = existingHomes.map(home => home.id === this.id ? this : home);``
            }
            else { // add new home
                this.id = new Date().getTime().toString(); // Ensure unique ID on save
                existingHomes.push(this);
            }
            fs.writeFile(homeDataPath, JSON.stringify(existingHomes), (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log('Home data saved successfully');
                }
            });
        });
    }

    static getAllHomes(callback) {
        fs.readFile(homeDataPath, (err, fileContent) => {
            if (err) {
                console.error('Error reading file', err);
                callback([]);
                return;
            }
            callback(JSON.parse(fileContent));
            // callback([]);
        });
    }

    static getHomeById(homeId, callback) {
        Home.getAllHomes(homes => {
            const homeFound = homes.find(h => h.id === homeId);
            callback(homeFound);
        })
    }
}