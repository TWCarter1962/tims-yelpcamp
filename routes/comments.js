// Including express router (use instead of app.)
var express = require("express");
// {mergeParams: true} allows the merging of the Campgrounds and Comments routes
// including :id
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Note: if you require a directory, it will automatically require
//the index.js in that directory
var middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new",{campground: campground});
        }
    });
    
});

// Comments Create
router.post("/",middleware.isLoggedIn, function(req, res){
    //lookup camground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comment
            //console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //connect new comment to campground
                    //add username and id to comment
                    //should have req.user because of the isLoggedIn function middleware
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //console.log("Comment User name will be: " + req.user.username);
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground show page 
                    console.log(comment);
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    // app.use("/campgrounds/:id/comments", commentRoutes); is in
    // app.js so can use req.params.id to get the campground id!
    // Add to check for campground again in case it's changed in the URL
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground){
            req.flash("error", "No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
            }
        });        
    });
});

//COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }        
    });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership,  function(req, res){
    //findByIdAndRemove()
    // Find and delete the correct comment
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;