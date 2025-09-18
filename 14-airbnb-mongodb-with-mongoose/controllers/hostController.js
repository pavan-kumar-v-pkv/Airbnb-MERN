const Home = require("../models/home");
const user = require("../models/user");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';

  Home.findById(homeId).then(home => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    console.log(homeId, editing, home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then(registeredHomes => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    })
  });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  const photo = req.file ? '/uploads/' + req.file.filename : '';
  console.log('File uploaded:', req.file);
  
  const home = new Home({
    houseName, 
    price, 
    location, 
    rating, 
    photo, 
    description
  });
  
  home.save().then(() => {
    console.log('Home Saved successfully');
    res.redirect("/host/host-home-list");
  }).catch(err => {
    console.error('Error saving home:', err);
    res.redirect("/host/add-home");
  });
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;
  let photoPath = req.body.existingPhoto; // Keep existing photo if no new one is uploaded
  
  if (req.file) {
    photoPath = '/uploads/' + req.file.filename; // Use new photo if uploaded
  }
  
  Home.findById(id).then((home) => {
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.photo = photoPath;
    home.description = description;
    
    home.save().then(result => {
      console.log('Home updated ', result);
      res.redirect("/host/host-home-list");
    }).catch(err => {
      console.log('Error while updating ', err);
      res.redirect("/host/host-home-list");
    });
  }).catch(err => {
    console.log('Error while fetching home for edit ', err);
    res.redirect("/host/host-home-list");
  });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log('Came to delete ', homeId);
  Home.findByIdAndDelete(homeId).then(() => {
    res.redirect("/host/host-home-list");
  }).catch(error => {
    console.log('Error while deleting ', error);
  })
};