var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

// Data to add to Campgrounds
var data = [
    {
        name: "Cloud's Rest",
        image: "https://farm2.staticflickr.com/1086/882244782_d067df2717.jpg",
        description: "Blessed is the man who doesn't walk in the counsel of the wicked, nor stand in the way of sinners, nor sit in the seat of scoffers; but his delight is in Yahweh's law. On his law he meditates day and night. He will be like a tree planted by the streams of water, that brings forth its fruit in its season, whose leaf also does not wither. Whatever he does shall prosper. The wicked are not so, but are like the chaff which the wind drives away. Therefore the wicked shall not stand in the judgment, nor sinners in the congregation of the righteous. For Yahweh knows the way of the righteous, but the way of the wicked shall perish."
    },
     {
        name: "Jellystone",
        image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
        description: "Blessed is the man who doesn't walk in the counsel of the wicked, nor stand in the way of sinners, nor sit in the seat of scoffers; but his delight is in Yahweh's law. On his law he meditates day and night. He will be like a tree planted by the streams of water, that brings forth its fruit in its season, whose leaf also does not wither. Whatever he does shall prosper. The wicked are not so, but are like the chaff which the wind drives away. Therefore the wicked shall not stand in the judgment, nor sinners in the congregation of the righteous. For Yahweh knows the way of the righteous, but the way of the wicked shall perish."
    },
    {
        name: "Tim's Camp",
        image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg",
        description: "Blessed is the man who doesn't walk in the counsel of the wicked, nor stand in the way of sinners, nor sit in the seat of scoffers; but his delight is in Yahweh's law. On his law he meditates day and night. He will be like a tree planted by the streams of water, that brings forth its fruit in its season, whose leaf also does not wither. Whatever he does shall prosper. The wicked are not so, but are like the chaff which the wind drives away. Therefore the wicked shall not stand in the judgment, nor sinners in the congregation of the righteous. For Yahweh knows the way of the righteous, but the way of the wicked shall perish."
    }
];

function seedDB(){
    // Remove everything in the campground db
    Campground.remove({}, function (err) {
        if (err){
            console.log(err);
        } else {
            console.log("Removed campgrounds!");
            // Add a few campgrounds (should be inside the callback for the remove function!)
            // so it will wait until all campgrounds are removed and then add the new campgrounds
          data.forEach(function(seed){
              Campground.create(seed, function(err, campground){
                  if (err) {
                      console.log(err);
                  } else {
                      console.log("Added a campground");
                      Comment.create(
                          {
                              text: "This place is great, but I wish there was internet.",
                              author: "Homer"
                          }, function(err, comment){
                              if (err) {
                                  console.log(err);
                              } else {
                                  // Associate the comment with the campground
                                  // this campground is the variable from the create callback 
                                  campground.comments.push(comment);
                                  campground.save();
                                  console.log("Created new comment");
                              }
                          });
                  }
              });
          });
        }
    });
   
   // Add a few comments
   
}

module.exports = seedDB;

