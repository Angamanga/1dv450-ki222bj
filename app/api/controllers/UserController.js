module.exports = {
'new'(req,res){
  res.view();
},
  create: function(req,res,next){
    User.create(req.params.all(), function userCreated(err,user){
      if (req.param("password") != req.param("confirmation")){
        return next("Passwords are not matching");
      }
      if(err){
        req.flash('err',err.ValidationError);
        return res.redirect('/user/new');
      }
      return res.json(user);
    })
  }
};

