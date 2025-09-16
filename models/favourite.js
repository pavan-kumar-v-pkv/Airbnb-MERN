const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/pathUtil');
const { promisify } = require('util');

const favouriteDataPath = path.join(rootDir, 'data', 'favourites.json');

// Convert fs functions to Promise-based versions
const readFilePromise = promisify(fs.readFile);
const writeFilePromise = promisify(fs.writeFile);

// Ensure the favourites.json file exists
const ensureFavouritesFileExists = () => {
    if (!fs.existsSync(path.dirname(favouriteDataPath))) {
        fs.mkdirSync(path.dirname(favouriteDataPath), { recursive: true });
    }
    if (!fs.existsSync(favouriteDataPath)) {
        fs.writeFileSync(favouriteDataPath, JSON.stringify([]));
    }
};

module.exports = class Favourite {
    static async addToFavourites(homeId) {
        ensureFavouritesFileExists();
        try {
            const favourites = await Favourite.getFavourites();
            if (favourites.includes(homeId)) {
                console.log("Home already in favourites");
                return Promise.resolve(); // No change needed
            } else {
                favourites.push(homeId);
                return writeFilePromise(favouriteDataPath, JSON.stringify(favourites));
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    static async getFavourites() {
        ensureFavouritesFileExists();
        try {
            const fileContent = await readFilePromise(favouriteDataPath);
            return JSON.parse(fileContent);
        } catch (error) {
            console.error('Error reading favourites:', error);
            return [];
        }
    }

    static async removeFavourite(homeId) {
        try {
            const favourites = await Favourite.getFavourites();
            const updatedFavourites = favourites.filter(id => id !== homeId);
            return writeFilePromise(favouriteDataPath, JSON.stringify(updatedFavourites));
        } catch (error) {
            return Promise.reject(error);
        }
    }

    static async deleteById(delHomeId) {
        try {
            const homeIds = await Favourite.getFavourites();
            const updatedIds = homeIds.filter(id => id !== delHomeId);
            return writeFilePromise(favouriteDataPath, JSON.stringify(updatedIds));
        } catch (error) {
            return Promise.reject(error);
        }
    }
}