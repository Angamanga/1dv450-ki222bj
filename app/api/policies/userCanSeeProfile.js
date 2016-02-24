"use strict";
module.exports = function(req,res,ok){
  let applicationIdMatchesUserId = false;
if(req.session.User.applications){
  req.session.User.applications.forEach((application)=>{
    if(application.id === req.param('id')){
      applicationIdMatchesUserId = true;
    }
  });
}
  let sessionUserMatchesId = (req.session.User.id === req.param('id') || applicationIdMatchesUserId);
  let isAdmin = req.session.User.admin;

  if(!(sessionUserMatchesId || isAdmin)){
    let requireAdminError = {name:'requireAdminError', message:'You must be an admin'};
    req.session.flash = {
      err:requireAdminError
    }
    res.redirect('/session/new');
    return;
  }
  ok();
}
