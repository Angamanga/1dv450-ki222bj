"use strict";
//setting admin-access
module.exports = function (req, res, next) {
  if (req.session.User && req.session.User.admin) {
    return next();
  }
  else {
    let requireLoginError = {name: 'requireLogin', message: 'You must be an admin.'};
    req.session.flash = {
      err: requireLoginError
    }
    res.redirect('/session/new');
    return;
  }
};
