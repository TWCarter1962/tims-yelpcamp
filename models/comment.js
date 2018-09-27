var mongoose = require("mongoose");

//author will just be the id (object) & the username (string) (not the salt & hash fields etc.)
var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);