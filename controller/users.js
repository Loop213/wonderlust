const User = require("../models/user.js");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError.js");

module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs"); // Corrected path to signup.ejs
};


module.exports.signup = async (req, res, next) => {
    try {
        // Correctly destructure username, email, and password from req.body
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        // Use await with User.register to save the new user
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);    
        // Automatically log in the user after registration
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings"); // Route paths are typically lowercase
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm=(req, res) => {
    res.render("users/login.ejs"); // Corrected path to login.ejs
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you logout successfully!");
        res.redirect("/listings");
    })
};
module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};