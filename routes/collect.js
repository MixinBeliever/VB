var express = require('express');
var router = express.Router();
var login_intercept = require('./common/login_intercept');
var collectModel = require('../model/collect');
var blogModel = require('../model/blog');
var formatMsgTimeModel = require('./common/Function');

/* GET users listing. */
router.get('/', function(req, res, next) {
    login_intercept((data)=>{
        var userInfo = data;
        var arr = [];
        // var final;
        var collectInfo = [];//收藏的时间
        var collectId = [];//收藏的id
        collectModel.find({
            user_id: req.session.admin_userInfo._id,
            status: 1,
        }).then(result => { //查找id和未取消的收藏信息，因为还要根据收藏的blogid依次去查询相应的信息，for循环里异步查找不会出结果，在这里我们使用数组查询
            //console.log(result);
            for (var i = 0; i < result.length; i++) {
                arr.push(result[i].blog_id)
                collectInfo.push(result[i].collect_time);
                collectId.push(result[i]._id);
            }
            //console.log(arr);

            blogModel.find({
                _id: { $in: arr }
            }).then(result2 => {
                //console.log(result);
                for (var i = 0; i < collectInfo.length; i++) {
                    result2[i].collect_time = collectInfo[i];
                    result2[i].collect_id = collectId[i];
                }
                // final = result;
                // console.log(final);//这里final只会得到promise对象的最终凝结的结果，但还是会有
                res.render('collect', { data: result2, userInfo: userInfo, formatMsgTime: formatMsgTimeModel });
            })
        })
    },req,res,next)
});

//取消收藏
router.post('/cancel',(req,res,next)=>{
    if(req.session.admin_userInfo){
        console.log(req.body.collectId);
        collectModel.update({
            _id: req.body.collectId,
        },{$set:{status: 0}}).then(result=>{
            res.send({ok:1})//取消收藏成功  
        }).catch(err=>{res.send({ok:0})})//取消失败 
    }else{
        res.send({ok:4})//未登录
    }
})


module.exports = router;
