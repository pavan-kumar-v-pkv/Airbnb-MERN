exports.getLogin = (req, res, next) => {
  res.render("auth/login", { 
    pageTitle: "Login", 
    currentPage: 'login',
    isLoggedIn: req.isLoggedIn
   });
}

exports.postLogin = (req, res, next) => {
  console.log(req.body);
  // res.cookie('isLoggedIn', true); // Set a cookie to indicate the user is logged in
  // req.isLoggedIn = true;
  req.session.isLoggedIn = true;
  res.redirect('/');
} 

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/login');
  })
  // req.isLoggedIn = false;
}