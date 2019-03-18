var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var obj = {
    user_id: String,
    blog_id: String,
    status: Number,
}

var model = mongoose.model('thumb',new Schema(obj));
module.exports = model;