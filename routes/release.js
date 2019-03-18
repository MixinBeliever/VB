var express = require('express');
var router = express.Router();
var login_intercept = require('./common/login_intercept');
var blogModel = require('../model/blog');
var multer = require('multer');
var upload = multer({dest: 'public/uploads/post'});


/* GET users listing. */
router.get('/', function(req, res, next) {
  login_intercept((data) => {
    var userInfo = data;
    res.render('release', { userInfo: userInfo });
  }, req, res, next); //通用session检测 封装模块
});

router.post('/success',upload.single('picture'),function(req, res, next) {
  //console.log(req.session);
  /*Session {
  cookie:
   { path: '/',
     _expires: 2019-03-18T07:43:57.333Z,
     originalMaxAge: 259200000,
     httpOnly: true },
  admin_userInfo:
   { _id: '5c88891102baa31f9441b70f',
     account: '18041166189',
     password: '123456',
     nickname: '刘攀',
     __v: 0,
     tel: 18041166189,
     gender: 3,
     birth: '97/09/02',
     level: 3,
     email: '863420364@qq.com',
     loving: 1 } } */
  if( req.session.admin_userInfo ){
    // console.log(req.body)
    // console.log(req.file)
    // return;
    blogModel.update({
      user_id: req.session.admin_userInfo._id},{$set:{newest: Date.now()}},{multi:true}).then(success=>{
        if(success){
          blogModel.create({
            user_id: req.session.admin_userInfo._id,
            content: req.body.content,
            picture: req.file?'/uploads/post/'+req.file.filename:req.session.admin_userInfo.picture,
            add_time: Date.now(), //事件戳
            newest: Date.now(),
          }).then(result=>{
            if(result){
              res.redirect('/')
            }
          }).catch(err=>{
      
          })
        }
    }).catch(err=>{

    })
  }else{
    res.redirect('/login')
  }
});

module.exports = router;
