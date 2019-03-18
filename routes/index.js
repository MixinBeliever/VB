var express = require('express');
var router = express.Router();
var blogModel = require('../model/blog');
var formatMsgTimeModel = require('./common/Function');
var admin_userModel = require('../model/admin_user');
var thumbModel = require('../model/thumb');
var collectModel = require('../model/collect');
var login_intercept = require('./common/login_intercept');


/* GET home page. */
// router.get('/', function(req, res, next) {
//   if(req.session.admin_userInfo){
//     //console.log(req.session.admin_userInfo)
//     // { _id: '5c88891102baa31f9441b70f',
//     //     account: '18041166189',
//     //     password: '123456',
//     //     nickname: '刘攀',
//     //     __v: 0 
//     //   }
//     //return;
//     //查询最新一次动态时间
    

//     blogModel.find().sort({add_time: -1}).then(result=>{
//         for(var i = 0; i<result.length; i++){
//           // console.log(result[i])
//           admin_userModel.find({_id: result[i].user_id},{nickname:1,pic:1}).then(result2=>{
           
//             console.log('65456415'+result[result.length-1])
//             //result[i].nickname = result2[0].nickname;
//           })
//           //console.log(result2);
//         }
        
//         res.render('index',{userInfo: req.session.admin_userInfo,blogInfo:result,formatMsgTime:formatMsgTimeModel});
//     }).catch(err=>{

//     })
    
//   }else{
//     //console.log('这是teoses')
//     res.redirect('/login');
//   }
// });

router.get('/', function(req, res, next) {
  var userInfo;
  login_intercept((data)=>{
     userInfo = data;
   }, req,res,next); //通用session检测 封装模块
    //console.log(req.session.admin_userInfo)
    // { _id: '5c88891102baa31f9441b70f',
    //     account: '18041166189',
    //     password: '123456',
    //     nickname: '刘攀',
    //     __v: 0 
    //   }
    //return;
    //查询最新一次动态时间
    blogModel.find().sort({add_time: -1}).then(result=>{
      var arr = [];
      var result_length = result.length;
      var final;
      function success(callback) {
        
        for (var i = 0; i < result.length; i++) {
          admin_userModel.find({ _id: result[i].user_id }).then(result2 => {
            //console.log(result2)
            callback(result2[0].nickname);

          })
        }
      }
      success((data) => { 
          arr.push(data);
        if (arr.length === result_length) {
            for (let i = 0; i < arr.length; i++) {
              result[i].nickname = arr[i];
              console.log(result)
            }
          //console.log(final)
          //console.log(arr)
          final = result;
          res.render('index', { userInfo: userInfo, blogInfo: final, formatMsgTime: formatMsgTimeModel });
          }
      });  
    }).catch(err=>{
      console.log(err)
    })
});


router.get('/logout', function(req, res, next) {
  if(req.session.admin_userInfo){
    req.session.destroy((error,info)=>{
      if(!error){
        res.redirect('/login');
      }
    })
  }else{
    //console.log('这是teoses')
    res.redirect('/login');
  }
});

router.post('/thumbs', function(req, res, next) {
  if(req.session.admin_userInfo){
    thumbModel.find({
      user_id: req.session.admin_userInfo._id,
      blog_id: req.body.blog_id
    }).then(result=>{
      console.log(req.session.admin_userInfo._id)
      console.log(req.body.blog_id)
      if(result.length == 1){
        res.send({ok:-1}); //已经赞过了
      }else{
        thumbModel.create({
          user_id: req.session.admin_userInfo._id,
          blog_id: req.body.blog_id,
          status: 1,
        }).then(result=>{
          if(result){
            blogModel.update({ _id: req.body.blog_id},{$inc: {thumbs: 1}}).then(result=>{
              res.send({ok:1}); //点赞成功
            }).catch(error=>{ console.log(error) })
          }else{ res.send({ok:5});}
        }).catch(error=>{
          console.log(error);
            res.send({ok:0}); //点赞失败
    
          })
      }
    })
   
  }else{
    //console.log('这是teoses')
    res.redirect('/login');
  }
});

//收藏
router.post('/collect', function(req, res, next) {
  if(req.session.admin_userInfo){
    collectModel.find({
      user_id: req.session.admin_userInfo._id,
      blog_id: req.body.blog_id
    }).then(result=>{
      console.log(req.session.admin_userInfo._id)
      console.log(req.body.blog_id)
      if(result.length == 1){
        //res.send({ok:-1}); //已经收藏过了
        if(result[0].status == 0){
          collectModel.update({_id: result[0]._id},{$set:{status: 1,collect_time: Date.now()}}).then(result=>{
            res.send({ok:1}); //收藏成功
          })
        }else{
          res.send({ok:-1}); //已经收藏过了
        }
      }else{
        collectModel.create({
          user_id: req.session.admin_userInfo._id,
          blog_id: req.body.blog_id,
          status: 1,
          collect_time: Date.now(),
        }).then(result=>{
              res.send({ok:1}); //收藏成功
        }).catch(error=>{
          console.log(error);
            res.send({ok:0}); //收藏失败
          })
      }
    }).catch(err=>{
      console.log(err)
    })
   
  }else{
    //console.log('这是teoses')
    res.redirect('/login');
  }
});

module.exports = router;
