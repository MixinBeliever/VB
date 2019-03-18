var express = require('express');
var router = express.Router();
var login_intercept = require('./common/login_intercept');



/* GET users listing. */
router.get('/', function(req, res, next) {
    login_intercept((data)=>{
        var userInfo = data;
        res.render('picForm',{userInfo: userInfo});
    },req,res,next)
});

module.exports = router;
