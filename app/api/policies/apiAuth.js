"use strict";

//TODO: refactor auth-functions
const bcrypt = require('bcrypt');

module.exports = (req, res, next)=>{
  console.log('hej'+req.param('email'));
  if(!req.param('email') || !req.param('password')) {
    //TODO: move strings to constant-file
    res.forbidden('You must enter both an email and a password');
  return;
  }
  User.findOne({email:req.param('email')},(err,user)=>{
    if(err){
      res.serverError('something went wrong' + err);
      return;
    }
    if(!user){
      res.forbidden('no user with ' + req.param('email') + ' was found');
    return;
    }
    bcrypt.compare(req.param('password'), user.encryptedPassword,(err,valid)=>{
      if(err){
        res.serverError('something went wrong' +err);
        return;
      }
      if(!valid){
        res.forbidden('You entered an invalid password or username');
        return;
      }
      next();
    });
  })
}
