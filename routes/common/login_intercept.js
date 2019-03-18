
var admin_user = require('../../model/admin_user');
function login_intercept(callback,req,res,next){
    if(req.session.admin_userInfo){
        //console.log(req.session.admin_userInfo)
        // { _id: '5c88891102baa31f9441b70f',
        //     account: '18041166189',
        //     password: '123456',
        //     nickname: '刘攀',
        //     __v: 0 
        //   }
        //return;
        admin_user.find({_id: req.session.admin_userInfo._id}).then(result=>{
          callback(result[0]);
        })
      }else{
        res.redirect('/login');
      }
}
module.exports = login_intercept;