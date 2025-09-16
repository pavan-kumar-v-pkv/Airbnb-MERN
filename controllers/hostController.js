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
    Home.getHomeById(homeId, home => {
        if (!home) {
            console.log("Home not found for ID:", homeId);
            return res.redirect('/host/host-homes-list');
        }

        console.log("Editing Home Details:", homeId, editing, home);
        res.render("host/edit-home", {
            pageTitle: "Edit your Home",
            currentPage: 'host-homes',
            editing: editing,
            home: home
        });

    });

}

exports.getHostHomes = (req, res, next) => {
    Home.getAllHomes((registeredHomes) => {
        console.log("Host homes list:", registeredHomes);
        
        res.render("host/host-home-list", {
            registeredHomes: registeredHomes || [],
            pageTitle: "Host Homes List",
            currentPage: 'host-homes'
        });
    });
}

exports.postAddHome = (req, res, next) => {
    console.log('Home registration successful:', req.body);
    const { title, description, price, location, bedrooms, bathrooms, amenities } = req.body;
    const newHome = new Home(title, description, price, location, bedrooms, bathrooms, amenities);
    newHome.save(() => {
        console.log("Home saved and redirecting");
        res.redirect("/host/host-home-list");
    });
}

exports.postEditHome = (req, res, next) => {
    console.log('Home editing successful:', req.body);
    const { homeId, title, description, price, location, bedrooms, bathrooms, amenities } = req.body;
    const updatedHome = new Home(title, description, price, location, bedrooms, bathrooms, amenities);
    updatedHome.id = homeId;
    updatedHome.save((err) => {
        if (err) {
            console.error("Error saving home:", err);
            return res.status(500).send("Error saving home");
        }
        res.redirect("/host/host-home-list");
    });
}

exports.postDeleteHome = (req, res, next) => {
    const homeId = req.params.homeId;
    console.log('Came to delete Home', homeId);
    Home.deleteById(homeId, error => {
        if (error) {
            console.error('Error deleting home:', error);
        } else {
            console.log('Home deleted successfully');
        }
        res.redirect("/host/host-home-list");
    });
}
