var express = require('express');
var router = express.Router();
var admin_users = require('../model/admin_user');
var session = require('express-session');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('samples/login');
});

router.post('/success',(req,res,next)=>{
    admin_users.find({
        account: req.body.account,
        password: req.body.password
    }).then(result=>{
        if(result.length){
            if(req.body.symbol == 1){
                req.session.admin_userInfo = result[0];
                // console.log('有session')
                // console.log(req.session.admin_userInfo)
                res.send({ok:1});
            }else{
                req.session.admin_userInfo = result[0];
                // req.session.two = result[0];
                // console.log('无session')
                // console.log(req.session.two)
                res.send({ok:1});
            }
        }else{
            res.send({ok:-1});
        }
    }).catch(err=>{
        res.send({ok:0});
    })
})

module.exports = router;
