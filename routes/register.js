var express = require('express');
var router = express.Router();
var admin_users = require('../model/admin_user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('samples/register');
});

router.post('/success', function(req, res, next) {
    console.log(req.body);
    // return;
    admin_users.find({
        account: req.body.account,
    }).then(result=>{
        if(result.length == 1){
            res.send({ok: -1}); //该用户名被注册
        }else{
            admin_users.create({
                account: req.body.account,
                password: req.body.password,
                nickname: req.body.nickname,
                add_time: Date.now(),
            }).then(result=>{
                if(result) res.send({ok: 1}); //注册成功
            }).catch(err=>{
                res.send({ok: 0});
            })
        } 
    }).catch(err=>{
        res.send({ok: 0});
    })
    
});

router.post('/checkAcc', function(req, res, next) {
    console.log(req.body);
    // return;
    admin_users.find({
        account: req.body.account,
    }).then(result=>{
        if(result.length == 1){
            res.send({ok: 1});
        }else{
            res.send({ok: 0});
        } 
    }).catch(err=>{
        res.send({ok: -1});
    })
});



module.exports = router;
