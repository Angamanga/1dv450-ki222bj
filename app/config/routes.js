//TODO: configure routes and change to api/
module.exports.routes = {
  '/': {
    view: 'static/index'
  },
  '/api':{
    view:'static/api'
  },
  '/user/new':{
    controller: 'UserController',
    action: 'new'
  }

};
