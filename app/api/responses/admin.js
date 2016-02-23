"use strict";
module.exports = function (req,res,ok) {
  let sessionUserMatchesId = req.session.User.id === req.param('id');
  let isAdmin = req.session.User.admin;


  if(!(sessionUserMatchesId || isAdmin)){
    let noRightsError = {name:'noRights', message:'You must be an admin'};
    res.session.flash = {
      err:noRightsError
    }
    res.redirect('/session/new');
    return;
  }
  ok();

};
