"use strict";
//controller for registering applications and generating api-keys
module.exports = {
  'create'(req, res, next){
    //registering an application associated to a logged in user and generating an api-key
    let appObj = {};
    let apiKey = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++) {
      apiKey += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    ;
    appObj = {
      name: req.param('name'),
      description: req.param('description'),
      userId: req.session.User.id,
      apiKey
    }
    //adding application and api-key to database
    Application.create(appObj, (err, app)=> {
      if (!err) {
        User.findOne({id: app.userId}).populate('applications').exec((err, user)=> {
          if (err) return next(err);
          if (!user) return next();
          req.session.User = user;
          res.redirect('/user/show/' + app.userId);
        });
      }
    });
  },
  edit(req, res, next){
    //enabling edit-mode
    req.session.editId = req.params['id'];
    res.redirect('/user/show/' + req.session.showId);
  },
  update(req, res, next){
    //updating an application
    let appObj = {
      name: req.param('name'),
      description: req.param('description')
    };
    Application.update({id: req.params['id']}, appObj, (err)=> {
      req.session.editId = undefined;
      res.redirect('/user/show/' + req.session.showId);
    });
  },
  destroy(req, res, next){
    //deleting an application
    req.session.editId = req.params['id'];

    Application.findOne({id: req.session.editId}, (err, application)=> {
      if (err) return next(err);
      if (!application) return next('Application doesn\'t exist.');

      Application.destroy({id: req.params['id']}, (err)=> {
        if (err) return next(err);
      });
      res.redirect('/user/show/' + req.session.showId);
    });
  },
  cancel(req, res, next){
    //canceling edit-mode
    req.session.appId = undefined;
    res.redirect('/user/show/' + req.session.showId);
  }
};

