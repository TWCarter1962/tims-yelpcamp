// YelpCamp 12Deployed to Heroku - Adding User Authentication (passport etc.)
// Can have one var and each variable sep by a comma.
var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User    = require("./models/user"),
    seedDB     = require("./seeds");
    
// Requiring routes
var campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments"),
    indexRoutes         = require("./routes/index");
    
//could use (but not sure how process.env.DATABASEURL works...)
// process.env.DATABASEURL - will set DATABASEURL on each server app is hosted on (c9 or heroku)

//console.log(process.env.DATABASEURL);

//mongoose.connect("mongodb://localhost/yelp_camp_v12");
//c9 env variable set using: export DATABASEURL=...see above
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12";
mongoose.connect(url);

// mlab (mongolab) db used by Heroku
// Using Env variable DATABASEURL above to Db / ID/Password are not exposed
// Change/Add Env in heroku on the site or using CLI: heroku config:set DATABASEURL=...see below
// mongoose.connect("mongodb://dbtimuser:dbt1mpassword@ds123532.mlab.com:23532/tcyelpcamp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// For method-override, what to look for (_method) to use method put
app.use(methodOverride("_method"));
//connect-flash used for displaying messages on the site
app.use(flash());

//console.log(__dirname);
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
//include requre in the use method
app.use(require("express-session")({
    secret: "Jesus is Lord of All",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// User.authenticate(), serializeUser, deserializeUser is available because
// passport-local-mongoose is setup on the User Schema
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// To pass req.user to every route (using middleware function)
// req.user contains the User info if logged in available via passport
// whatever is placed in res.locals is available in the template
// runs on every single route so must have next() to run code
// on the routes
// Also include flash messages on every template (if it's been set)
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Setup app to use the Routes setup in separate files (required above)
// including "/xyz" as the first parameter tells the routes in the 
// routes file to start with "/xyz" so that can be removed on the file
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Tell Express to listen for requests (start server)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!!!");
});