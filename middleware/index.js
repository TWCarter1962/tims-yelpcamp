// All the middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

//Add functions
middlewareObj.checkCampgroundOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err || !foundCampground){
                //console.log(err);
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // Does the user Own the campground
                //foundCampground.author.id is a mongoose object
                //req.user._id is a String
                //Use .equals to compare
               if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });        
    } else {
        // Takes you back to the previous page you were on
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err  || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // Does the user Own the comment
                //foundComment.author.id is a mongoose object
                //req.user._id is a String
                //Use .equals to compare
               if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });        
    } else {
        // Takes you back to the previous page you were on
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

//Middleware to check if user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;

//Could be like following
// module.exports = {
//     functions go in here...
// }