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
        .then(home => {
            if (!home) {
                console.log("Home not found for ID:", homeId);
                return res.redirect('/host/host-home-list');
            }
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
            res.redirect('/host/host-home-list');
        });
}

exports.getHostHomes = (req, res, next) => {
    console.log("getHostHomes method called");
    
    Home.getAllHomes()
        .then(registeredHomes => {
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
    const { title, description, price, location, bedrooms, bathrooms, amenities } = req.body;
    
    // Create home without setting id initially
    const newHome = new Home(null, title, description, price, location, bedrooms, bathrooms, amenities);
    newHome.save()
        .then(() => {
            console.log('Home saved successfully');
            res.redirect('/host/host-home-list'); // Redirect to host home list
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
    
    // Create home with the ID for editing
    const updatedHome = new Home(homeId, title, description, price, location, bedrooms, bathrooms, amenities);
    
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
