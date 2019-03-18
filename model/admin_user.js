var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var obj = {
    nickname: String,
    tel: Number,
    gender: Number,
    pic: String,
    birth: String,
    level: Number,  
    email: String, 
    account: String,
    password: String,
    creat_time: Date,
    loving: Number,
}

var model = mongoose.model('admin_user',new Schema(obj));
module.exports = model;