// Including express router (use instead of app.)
var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root Route
router.get("/", function(req,res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res) {
    res.render("register");
});
// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //console.log(err);
            //req.flash("error", err.message);
            //return res.render("register");

            //Only the following
            //return res.render("register", {error: err.message});

            // or
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp "+ user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});
// handling login logic
// uses a middleware via the following line set above
// passport.use(new LocalStrategy(User.authenticate()));
// NOTE: same passport.authenticate function as used above except a new user
// is registered first and then passed to authenticate.
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

// Logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

//Middleware to check if user is logged in
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;