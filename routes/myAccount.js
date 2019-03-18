var express = require('express');
var router = express.Router();
var admin_userModel = require('../model/admin_user');
var login_intercept = require('./common/login_intercept');
var multer = require('multer');
var uploads = multer({dest: 'public/uploads/admin_pic'})//这里要加public

/* GET users listing. */
router.get('/', function(req, res, next) {
  login_intercept((data)=>{
    var userInfo = data;
    admin_userModel.find({
      _id: req.session.admin_userInfo._id
    }).then(result => {
      if (result) {
        res.render('myAccount', { userInfo: userInfo });
      }
    })
  },req,res,next)
    //console.log(req.session.admin_userInfo)
    // { _id: '5c88891102baa31f9441b70f',
    //     account: '18041166189',
    //     password: '123456',
    //     nickname: '刘攀',
    //     __v: 0 
    //   }
    //return;
   
 
});

router.post('/changeInfo', function(req, res, next) {
  if(req.session.admin_userInfo){
    // console.log(req.session.admin_userInfo)
    // console.log(req.body)
    // console.log(req.body.file)
    // return;
    admin_userModel.update({_id: req.session.admin_userInfo._id},
      {$set:{
        nickname: req.body.nickname,
        tel: req.body.tel,    
        gender: req.body.gender, 
        birth: req.body.birth,  
        level: req.body.level,  
        email: req.body.email, 
        loving: req.body.loving,
        motto: req.body.motto,
      }}).then(result=>{
        if(result){
          console.log('保存成功')
          res.send({ok:1});
        }else{
          console.log('保存失败')
          res.send({ok:0});
        }
    }).catch(err=>{
      console.log('请求失败');
      console.log(err)
      res.send({ok:0});
    })
  }else{
    res.redirect('/login');
  }
  
});

router.post('/upload_pic', uploads.single('upload_file'),(req,res,next)=>{
  console.log(req.file);
  admin_userModel.update({ _id: req.session.admin_userInfo._id, }, { $set: { pic: '/uploads/admin_pic/'+req.file.filename } }).then(result => {
    if (result) {
      res.send('success');
    }
  })

})
module.exports = router;
