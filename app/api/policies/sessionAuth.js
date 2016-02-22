"use strict";
module.exports = function(req, res, next) {
  if (req.session.authenticated) {
    return next();
  }

    else{
    let requireLoginError = {name:'requireLogin', message:'You must be signed in.'};
    req.session.flash = {
      err: requireLoginError
    }
    res.redirect('/session/new');
    return;
  }
};
