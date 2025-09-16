const db = require('../utils/databaseUtil');
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
        if (this.id) {
            // Update existing home
            const query = 'UPDATE homes SET title = ?, description = ?, price = ?, location = ?, bedrooms = ?, bathrooms = ?, amenities = ? WHERE id = ?';
            console.log('Executing UPDATE query:', query);
            console.log('With params:', [this.title, this.description, this.price, this.location, this.bedrooms, this.bathrooms, this.amenities, this.id]);
            
            return db.execute(
                query,
                [this.title, this.description, this.price, this.location, this.bedrooms, this.bathrooms, this.amenities, this.id]
            );
        } else {
            // Insert new home
            this.id = new Date().getTime().toString();
            const query = 'INSERT INTO homes (id, title, description, price, location, bedrooms, bathrooms, amenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            console.log('Executing INSERT query:', query);
            console.log('With params:', [this.id, this.title, this.description, this.price, this.location, this.bedrooms, this.bathrooms, this.amenities]);
            
            return db.execute(
                query,
                [this.id, this.title, this.description, this.price, this.location, this.bedrooms, this.bathrooms, this.amenities]
            );
        }
    }

    static getAllHomes() {
        console.log('Executing getAllHomes query: SELECT * FROM homes');
        return db.execute('SELECT * FROM homes');
    }

    static getHomeById(homeId) {
        return db.execute('SELECT * FROM homes WHERE id = ?', [homeId]);
    }

    static deleteById(homeId) {
        return db.execute('DELETE FROM homes WHERE id = ?', [homeId]);
    }
};