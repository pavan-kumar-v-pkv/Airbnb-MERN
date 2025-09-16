const Favourite = require("../models/favourite");
const Home = require("../models/home");

exports.getIndex = (req, res, next) => {
    Home.getAllHomes().then(([registeredHomes, fields]) => {
        res.render("store/index", { 
            registeredHomes: registeredHomes, 
            pageTitle: "Airbnb Home", 
            currentPage: 'index' 
        });
    }).catch(err => {
        console.error("Error fetching homes:", err);
        res.render("store/index", { 
            registeredHomes: [], 
            pageTitle: "Airbnb Home", 
            currentPage: 'index' 
        });
    }).catch(err => {
        console.error("Error fetching homes:", err);
        res.render("store/index", { 
            registeredHomes: [], 
            pageTitle: "Airbnb Home", 
            currentPage: 'index' 
        });
    });
}

exports.getHomes = (req, res, next) => {
    Home.getAllHomes().then(([registeredHomes, fields]) => {
        console.log(registeredHomes);
        res.render("store/home-list", { 
            registeredHomes: registeredHomes, 
            pageTitle: "Homes List", 
            currentPage: 'Homes' 
        });
    }).catch(err => {
        console.error("Error fetching homes:", err);
        res.render("store/home-list", { 
            registeredHomes: [], 
            pageTitle: "Homes List", 
            currentPage: 'Homes' 
        });
    });
}

exports.getHomeDetails = (req, res, next) => {
    const homeId = req.params.homeId;
    Home.getHomeById(homeId).then(([homes, fields]) => {
        const home = homes[0];
        if(!home){
            console.log("Home not found for ID:", homeId);
            res.redirect('/homes');
            return;
        }
        else{
            console.log("Home Details:", home);
            console.log("Home ID:", home.id);
            res.render("store/home-details", { 
                home: home, 
                pageTitle: "Home Details", 
                currentPage: 'Homes' });
        }
    }).catch(err => {
        console.error("Error fetching home details:", err);
        res.redirect('/homes');
    });
};

exports.getBookings = (req, res, next) => {
    res.render("store/bookings", { pageTitle: "My Bookings", 
        currentPage: 'bookings' });
};

exports.getFavouriteList = (req, res, next) => {
    // First get all the favourite home IDs
    Favourite.getFavourites()
        .then(favouriteIds => {
            if (favouriteIds.length === 0) {
                // No favorites yet
                return res.render("store/favourite-list", { 
                    registeredHomes: [], 
                    pageTitle: "My favourites", 
                    currentPage: 'favourites' 
                });
            }
            
            // Then get all homes and filter them to show only the favorites
            Home.getAllHomes()
                .then(([allHomes, fields]) => {
                    const favouriteHomes = allHomes.filter(home => favouriteIds.includes(home.id));
                    console.log("Favourite homes:", favouriteHomes);
                    
                    res.render("store/favourite-list", { 
                        registeredHomes: favouriteHomes, 
                        pageTitle: "My favourites", 
                        currentPage: 'favourites' 
                    });
                })
                .catch(err => {
                    console.error("Error fetching all homes:", err);
                    res.status(500).render('error', { 
                        pageTitle: 'Error', 
                        message: 'Failed to fetch homes' 
                    });
                });
        })
        .catch(err => {
            console.error("Error fetching favourites:", err);
            res.status(500).render('error', { 
                pageTitle: 'Error', 
                message: 'Failed to fetch favourites' 
            });
        });
};

exports.postAddToFavourites = (req, res, next) => {
    const homeId = req.body.homeId;
    console.log("Adding to favourites:", homeId);
    
    if (!homeId) {
        return res.status(400).send("Home ID is required");
    }
    
    Favourite.addToFavourites(homeId)
        .then(() => {
            // Redirect to the favourites page
            res.redirect('/favourites');
        })
        .catch(err => {
            console.error("Error adding to favourites:", err);
            res.status(500).render('error', { 
                pageTitle: 'Error', 
                message: 'Failed to add to favourites' 
            });
        });
};

exports.postRemoveFavourite = (req, res, next) => {
    const homeId = req.body.homeId;
    console.log("Removing from favourites:", homeId);
    
    if (!homeId) {
        return res.status(400).send("Home ID is required");
    }
    
    Favourite.removeFavourite(homeId)
        .then(() => {
            res.redirect('/favourites');
        })
        .catch(err => {
            console.error("Error removing from favourites:", err);
            res.status(500).render('error', { 
                pageTitle: 'Error', 
                message: 'Failed to remove from favourites' 
            });
        });
};

