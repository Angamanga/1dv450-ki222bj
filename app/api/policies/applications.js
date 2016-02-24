"use strict";

//restricting what a user and what admin can access
module.exports = function (req, res, ok) {
  let sessionUserMatchesshowId = (req.session.User.id === req.session.showId);
  let isAdmin = req.session.User.admin;
  if (!(sessionUserMatchesshowId || isAdmin)) {
    let requireAdminError = {name: 'requireAdminError', message: 'You must be an admin'};
    req.session.flash = {
      err: requireAdminError
    }
    res.redirect('/session/new');
    return;
  }
  ok();
}
