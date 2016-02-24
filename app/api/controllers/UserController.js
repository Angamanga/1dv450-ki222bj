"use strict";
//Controller for creating, updating, editing, showing and deleting users
module.exports = {
  'new'(req, res){
    res.view();
  },
  create(req, res, next){
    //defining userObject
    let userObj = {
      name: req.param('name'),
      email: req.param('email'),
      password: req.param('password'),
      confirmation: req.param('confirmation')
    }
    //creating user
    User.create(userObj, (err, user)=> {
      if (err) {
        req.session.flash = {'err': err};
        return res.redirect('/user/new');
      }
      //logging user in and redirecting to show user-profile
      req.session.authenticated = true;
      req.session.User = user;
      res.redirect('/user/show/' + user.id);
    });
  },
  show(req, res, next){
    //showing userprofile and populating user with associated applications
    req.session.showId = req.params['id'];
    User.findOne({id: req.session.showId}).populate('applications').exec((err, user)=> {
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user
      });
    });
  },
  index(req, res, next){
    //showing admin-page
    User.find({}, (err, users)=> {
      if (err) return next(err);
      res.view({
        users: users
      });
    });
  },
  edit(req, res, next){
    //method helping rendering edit-page
    User.findOne({id: req.params['id']}, (err, user)=> {
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user
      });
    });
  },
  update(req, res, next){
    //method for updating changes
    let userObj = {};
    if (req.session.User.admin) {
      userObj = {
        name: req.param('name'),
        email: req.param('email'),
        admin: req.param('admin')
      };
    }
    else {
      userObj = {
        name: req.param('name'),
        email: req.param('email'),
      };
    }
    User.update({id: req.params['id']}, userObj, (err)=> {
      if (err) {
        return res.redirect('/user/edit/' + req.param('id'));
      }
      res.redirect('/user/show/' + req.param('id'));
    });
  },
  destroy(req, res, next){
    //method for deleting a user, removing associated applications first...
    Application.find({userId: req.params['id']}, (err, applications) =>{
      applications.forEach((app)=> {
        Application.destroy({id: app.id}, (err)=> {
          if (err) return next(err);
        });
      });
    });
//...and then the user
    User.findOne({id: req.params['id']}, (err, user)=> {
      if (err) return next(err);
      if (!user) return next('User doesn\'t exist.');
      User.destroy({id: req.params['id']}, (err)=> {
        if (err) return next(err);
      });
      res.redirect('/user');
    });
  }
}
