var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var obj = {
    user_id: String,
    blog_id: String,
    status: Number,
    collect_time: Date,
}

var model = mongoose.model('collect',new Schema(obj));
module.exports = model;