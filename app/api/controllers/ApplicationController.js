"use strict";
module.exports = {
  'create'(req, res, next){
    let appObj = {};
    let apiKey = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i=0; i < 10; i++ ){
      apiKey += possible.charAt(Math.floor(Math.random() * possible.length));
    };

    appObj = {
      name:req.param('name'),
      description:req.param('description'),
      userId:req.session.User.id,
      apiKey
    }
    Application.create(appObj, (err,app)=>{
      if(!err){
        res.redirect('/user/show/' + app.userId);
      }
    });

  }
  };

