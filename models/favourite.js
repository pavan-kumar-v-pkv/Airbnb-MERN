const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/pathUtil');

const favouriteDataPath = path.join(rootDir, 'data', 'favourites.json'); 

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
    static addToFavourites(homeId, callback) {
        ensureFavouritesFileExists();
        Favourite.getFavourites((favourites) => {
            if(favourites.includes(homeId)){
                console.log("Home already in favourites");
                callback(null); // No error, but no change either
            }
            else{
                favourites.push(homeId);
                fs.writeFile(favouriteDataPath, JSON.stringify(favourites), callback);
            }
        });
    }
    
    static getFavourites(callback) {
        ensureFavouritesFileExists();
        fs.readFile(favouriteDataPath, (err, fileContent) => {
            callback(!err ? JSON.parse(fileContent) : []);
        });
    }
    
    static removeFavourite(homeId, callback) {
        Favourite.getFavourites((favourites) => {
            const updatedFavourites = favourites.filter(id => id !== homeId);
            fs.writeFile(favouriteDataPath, JSON.stringify(updatedFavourites), callback);
        });
    }
}