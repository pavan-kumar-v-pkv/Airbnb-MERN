const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
    res.render("host/addHome", { pageTitle: "Add Home", currentPage: 'add-home' });
}

exports.getHostHomes = (req, res, next) => {
    Home.getAllHomes((registeredHomes) => {
        console.log(registeredHomes);
        res.render("host/host-home-list", { registeredHomes: registeredHomes, 
            pageTitle: "Host Homes List", 
            currentPage: 'host-homes' 
        });
    });
}

exports.postAddHome = (req, res, next) => {
    console.log('Home registration successful:', req.body);
    const {title, description, price, location, bedrooms, bathrooms, amenities} = req.body;
    const newHome = new Home(title, description, price, location, bedrooms, bathrooms, amenities);
    newHome.save();
    res.render("host/homeAdded", { pageTitle: "Home Added", home: newHome });
}
