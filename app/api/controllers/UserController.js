"use strict";

module.exports = {
'new'(req,res){
  res.view();
},
  create(req,res,next){
    User.create(req.params.all(), (err,user)=>{
      if(err){
        req.session.flash = {'err':err};
        return res.redirect('/user/new');
      }
      req.session.authenticated = true;
      req.session.User = user;
      res.redirect('/user/show/' + user.id);
    });
  },
  show(req,res,next){
    User.findOne({id:req.params['id']},(err, user)=>{
      console.log(user);
    if(err) return next(err);
      if(!user) return next();
      res.view({
      user:user
      });
    });
  },
  index(req, res, next){
    User.find({},(err,users)=>{
    if(err) return next(err);
    res.view({
      users:users
    });
  });
},
edit(req, res, next){
  User.findOne({id:req.params['id']},(err, user)=>{
    console.log(user);
    if(err) return next(err);
    if(!user) return next();
    res.view({
      user:user
    });
  });
},
  update(req,res,next){
    User.update({id:req.params['id']}, req.params.all(), (err)=>{
      if(err){
        return res.redirect('/user/edit/'+req.param('id'));
      }
      res.redirect('/user/show/' + req.param('id'));
    });
  },
  destroy(req,res,next){
    User.findOne({id:req.params['id']},(err,user)=>{
      if(err) return next(err);
      if(!user) return next('User doesn\'t exist.');

      User.destroy({id:req.params['id']}, (err)=>{
        if(err) return next(err);
      });
      res.redirect('/user');
    });
  }
}

