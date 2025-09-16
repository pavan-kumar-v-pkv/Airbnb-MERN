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

    save(callback) {
        Home.getAllHomes(existingHomes => {
            try {
                if (this.id) { // edit existing home
                    const index = existingHomes.findIndex(home => home.id === this.id);
                    if (index !== -1) {
                        existingHomes[index] = this;
                    } else {
                        console.log("Home not found for update, adding new");
                        this.id = new Date().getTime().toString(); // Generate new ID
                        existingHomes.push(this);
                    }
                } else { // add new home
                    this.id = new Date().getTime().toString(); // Ensure unique ID on save
                    console.log("Adding new home with ID:", this.id);
                    existingHomes.push(this);
                }
                
                const dataToWrite = JSON.stringify(existingHomes, null, 2); // Pretty print JSON
                console.log("Writing data to file:", dataToWrite.substring(0, 100) + "...");
                
                fs.writeFile(homeDataPath, dataToWrite, (err) => {
                    if (err) {
                        console.error('Error writing to file', err);
                    } else {
                        console.log('Home data saved successfully');
                    }
                    if (callback) {
                        callback(err);
                    }
                });
            } catch (error) {
                console.error("Error in save method:", error);
                if (callback) {
                    callback(error);
                }
            }
        });
    }

    static getAllHomes(callback) {
        // Ensure the homes.json file exists
        if (!fs.existsSync(homeDataPath)) {
            console.log("Creating new homes.json file");
            try {
                fs.writeFileSync(homeDataPath, JSON.stringify([]));
            } catch (error) {
                console.error("Error creating homes.json:", error);
            }
        }
        
        fs.readFile(homeDataPath, (err, fileContent) => {
            if (err) {
                console.error('Error reading file', err);
                callback([]);
                return;
            }
            
            try {
                const parsedContent = JSON.parse(fileContent);
                console.log(`Found ${parsedContent.length} homes in file`);
                callback(parsedContent);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                callback([]);
            }
        });
    }

    static getHomeById(homeId, callback) {
        Home.getAllHomes(homes => {
            const homeFound = homes.find(h => h.id === homeId);
            callback(homeFound);
        })
    }

    static deleteById(homeId, callback) {
        Home.getAllHomes(homes => {
            homes = homes.filter(h => h.id !== homeId);
            fs.writeFile(homeDataPath, JSON.stringify(homes), callback);
        })
    }
}