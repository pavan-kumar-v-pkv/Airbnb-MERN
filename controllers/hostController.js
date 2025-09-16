const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
    res.render("host/edit-home", {
        pageTitle: "Add Home",
        currentPage: 'add-home',
        editing: false,
    });
}

exports.getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    const editing = req.query.editing === 'true';
    
    Home.getHomeById(homeId)
        .then(([homes, fieldData]) => {
            if (!homes || homes.length === 0) {
                console.log("Home not found for ID:", homeId);
                return res.redirect('/host/host-homes-list');
            }
            
            const home = homes[0];
            console.log("Editing Home Details:", homeId, editing, home);
            
            res.render("host/edit-home", {
                pageTitle: "Edit your Home",
                currentPage: 'host-homes',
                editing: editing,
                home: home
            });
        })
        .catch(err => {
            console.error("Error fetching home for editing:", err);
            res.redirect('/host/host-homes-list');
        });
}

exports.getHostHomes = (req, res, next) => {
    console.log("getHostHomes method called");
    
    Home.getAllHomes()
        .then(([registeredHomes, fields]) => {
            console.log("Host homes list from database:", registeredHomes);
            console.log("Number of homes found:", registeredHomes.length);
            
            // If we have homes, render them
            res.render("host/host-home-list", {
                registeredHomes: registeredHomes,
                pageTitle: "Host Homes List",
                currentPage: 'host-homes'
            });
        })
        .catch(err => {
            console.error("Error fetching homes:", err);
            res.status(500).render('error', { 
                pageTitle: 'Error', 
                message: 'Failed to fetch homes: ' + err.message 
            });
        });
}

exports.postAddHome = (req, res, next) => {
    console.log('Home registration request received:', req.body);
    
    // Convert string values to appropriate types
    const title = req.body.title;
    const description = req.body.description;
    const price = parseFloat(req.body.price);
    const location = req.body.location;
    const bedrooms = parseInt(req.body.bedrooms, 10);
    const bathrooms = parseInt(req.body.bathrooms, 10);
    const amenities = req.body.amenities;
    
    console.log('Converted values:', {
        title, description, price, location, bedrooms, bathrooms, amenities
    });
    
    const newHome = new Home(title, description, price, location, bedrooms, bathrooms, amenities);
    
    newHome.save()
        .then(([result]) => {
            console.log("Home saved successfully with ID:", newHome.id);
            console.log("Database result:", result);
            
            // Wait a brief moment before redirecting to ensure the transaction is complete
            setTimeout(() => {
                res.redirect("/host/host-home-list");
            }, 100);
        })
        .catch(err => {
            console.error("Error saving home:", err);
            res.status(500).render('error', { 
                pageTitle: 'Error', 
                message: 'Failed to save home: ' + err.message 
            });
        });
}

exports.postEditHome = (req, res, next) => {
    console.log('Home editing request received:', req.body);
    const { homeId, title, description, price, location, bedrooms, bathrooms, amenities } = req.body;
    
    // Create home without setting id initially
    const updatedHome = new Home(title, description, price, location, bedrooms, bathrooms, amenities);
    
    // Set the ID separately for editing
    updatedHome.id = homeId;
    
    console.log('Updating home with ID:', homeId);
    
    updatedHome.save()
        .then(() => {
            console.log("Home updated successfully");
            res.redirect("/host/host-home-list");
        })
        .catch(err => {
            console.error("Error updating home:", err);
            res.status(500).render('error', { 
                pageTitle: 'Error', 
                message: 'Failed to update home: ' + err.message 
            });
        });
}

exports.postDeleteHome = (req, res, next) => {
    const homeId = req.params.homeId;
    console.log('Came to delete Home', homeId);
    
    Home.deleteById(homeId)
        .then(() => {
            console.log('Home deleted successfully');
            res.redirect("/host/host-home-list");
        })
        .catch(error => {
            console.error('Error deleting home:', error);
            res.status(500).render('error', { 
                pageTitle: 'Error', 
                message: 'Failed to delete home' 
            });
        });
}
