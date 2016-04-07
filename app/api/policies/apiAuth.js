"use strict";

//TODO: refactor auth-functions
const bcrypt = require('bcrypt');

module.exports = (req, res, next)=>{
let auth, email, password;
//checking headers and decoding information (base64)
    auth = new Buffer(req.headers.authorization.slice(6), 'base64').toString('ascii').split(':');
    email = auth[0];
    password =auth[1];
    if(email === '' || password ===''){
      res.forbidden('You must enter both an email and a password');
      return;
    }

//checking usercredentials
  User.findOne({email:email},(err,user)=>{
    if(err){
      res.serverError('something went wrong' + err);
      return;
    }
    if(!user){
      res.forbidden('You entered an invalid password or username');
    return;
    }
    bcrypt.compare(password, user.encryptedPassword,(err,valid)=>{
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
