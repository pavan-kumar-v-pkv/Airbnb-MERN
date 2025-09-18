const { check, body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", { 
    pageTitle: "Login", 
    currentPage: 'login',
    isLoggedIn: req.session.isLoggedIn || false,
    errorMessage: null,
    oldInput: { email: '', password: '' },
    user: {},
   });
}

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    currentPage: 'signup',
    isLoggedIn: false,
    errors: [],
    oldInput: { firstName: '', lastName: '', email: '', password: '', userType: '' },
    user: {}
  })
}

exports.postSignup = [
  // first name validation
  check('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long')
    .matches(/^[A-Za-z]+$/)
    .withMessage('First name must contain only letters'),
  // last name validation
  check('lastName')
    .optional({ checkFalsy: true }) // Makes lastName optional
    .matches(/^[A-Za-z]*$/)
    .withMessage('Last name must contain only letters'),
  // email validation
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  // password validation
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[\W_]/)
    .withMessage('Password must contain at least one special character')
    .trim(),
  // confirm password validation
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  // check user type
  check('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['host', 'guest'])
    .withMessage('Invalid user type'),
  // terms
  check('terms')
    .equals('on')
    .withMessage('You must accept the terms and conditions')
    .custom((value, { req }) => {
      if (value !== 'on') {
        throw new Error('You must accept the terms and conditions');
      }
      return true;
    }),
  // if validation passes,
  // process the request after validation
  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // there are validation errors
      return res.status(422).render('auth/signup', {
        pageTitle: 'Sign Up',
        currentPage: 'signup',
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
        oldInput: { firstName, lastName, email, password, userType }
      });
    }

    // hash the password before saving
    bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          userType
        });
        return user.save();
      })
      .then(() => {
        console.log("User created successfully:", email);
        res.redirect('/login');
      })
      .catch(err => {
        console.error("Error creating user:", err);
        return res.status(422).render('auth/signup', {
          pageTitle: 'Sign Up',
          currentPage: 'signup',
          isLoggedIn: false,
          errors: [err.message],
          oldInput: { firstName, lastName, email, password, userType },
          user: {}
        });
      });
  }
];


exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  // Find user by email
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          pageTitle: 'Login',
          currentPage: 'login',
          isLoggedIn: false,
          errorMessage: 'Invalid email or password',
          oldInput: { email, password },
          user: {}
        });
      }
      
      // Compare passwords
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          
          return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            currentPage: 'login',
            isLoggedIn: false,
            errorMessage: 'Invalid email or password',
            oldInput: { email, password },
            user: {},
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/login');
    });
} 

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/login');
  })
  // req.isLoggedIn = false;
}