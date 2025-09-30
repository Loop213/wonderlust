const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js"); // Make sure to import the User model
const wrapAsync = require("../utils/wrapAsync"); // Use an async error handler
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/users.js");
const user = require("../models/user.js");


router
.route("/signup")
.get(userController.signupForm ) // GET route to display the signup form
.post(wrapAsync(userController.signup)); // POST route to handle user registration


router
.route("/login")
.get(userController.loginForm) // GET route to display the login form
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login); // POST route to handle user login


router.get("/logout",userController.logout);

module.exports = router;