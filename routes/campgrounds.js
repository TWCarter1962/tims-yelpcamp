// Including express router (use instead of app.)
var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

//Note: if you require a directory, it will automatically require
//the index.js in that directory
var middleware = require("../middleware");

// INDEX route (RESTFUL) - show all campgrounds
router.get("/", function(req,res){
    // can pass data to the template (.ejs page)
    // using currentUser: req.user
    // removed because setup in app.use... res.locals.currentUser = req.user; above
    //console.log(req.user);
    // Get all campgrounds from the DB
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
    
});

// CREATE route (RESTFUL) - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req,res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    // campgrounds.push(newCampground);
    Campground.create(newCampground, function(err,newlyCreated){
        if(err) {
            console.log(err);
        } else {
            // reroute back to the campgrounds page 
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

// NEW route (RESTFUL) - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW route (RESTFUL) - shows info about one campground
// Note: Must be below "/campgrounds/new" route!
router.get("/:id", function(req, res) {
    //find the campground with the provided ID
    //plus use .populate("comments").exec(...) to populate the comments
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            //console.log(foundCampground);
            //render the show template with that campground found
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
    
});

// Edit Campground Route
//Call middleware to see if user logged in and is the same user
//as the author of the campground. It's run before the route handler code
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });        
});

// Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    // redirect to the Show page
    
});

// Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // Find and delete the correct campground
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/campgrounds/");
        } else {
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;