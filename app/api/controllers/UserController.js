module.exports = {
'new'(req,res){
  res.view();
},
  create(req,res,next){
    User.create(req.params.all(), function userCreated(err,user){
      if (req.param("password") != req.param("confirmation")){
        return next("Passwords are not matching");
      }
      if(err){
        req.session.flash = {'err':err};
        return res.redirect('/user/new');
      }
      return res.json(user);
    })
  }
};

