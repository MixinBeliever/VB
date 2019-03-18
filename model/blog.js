var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var obj = {
    user_id: String,
    content: String,
    picture: String,
    thumbs: Number,
    comments: Number,
    forward: Number,
    add_time: Date,
    newest: Date,
}

var model = mongoose.model('blog',new Schema(obj));
module.exports = model;