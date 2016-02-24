"use strict";
//controller for logging in and out user
const bcrypt = require('bcrypt');

module.exports = {
  'new'(req, res){
    res.view('session/new');
  },
  'create'(req, res, next){
    //checking if user has entered email and password
    if (!req.param('email') || !req.param('password')) {
      let usernamePasswordRequiredError = {
        name: 'usernamePasswordRequired',
        message: 'You must enter both an email and a password'
      };
      req.session.flash = {
        err: usernamePasswordRequiredError
      }
      res.redirect('/session/new');
      return;
    }
    //checking if user exists
    User.findOne({email: req.param('email')}, (err, user)=> {
      if (err) return next(err);
      if (!user) {
        let noAccountError = {
          name: 'noAccount',
          message: 'The email address ' + req.param('email') + ' was not found.'
        };
        req.session.flash = {
          err: noAccountError
        }
        res.redirect('/session/new');
        return;
      }
      //checking password
      bcrypt.compare(req.param('password'), user.encryptedPassword, (err, valid)=> {
        if (err) return next(err);
        if (!valid) {
          let usernamePasswordMismatchError = {
            name: 'usernamePasswordMismatchError',
            message: 'Invalid username or password combination'
          };
          req.session.flash = {
            err: usernamePasswordMismatchError
          }
          res.redirect('/session/new');
          return;
        }
        //logging in
        req.session.authenticated = true;
        req.session.User = user;
        req.session.User.admin === true ? res.redirect('/user') : res.redirect('user/show/' + user.id);
      });
    });
  }
  ,
  destroy(req, res, next){
    //logging out user
    req.session.destroy();
    res.redirect('/session/new/');
  }
};

