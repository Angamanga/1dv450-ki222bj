module.exports.routes = {
  '/': {
    view: 'static/index'
  },

  'get /login': {
    view: 'login',
    message:''
  },

  'post /login': 'AuthController.login',

  '/logout': 'AuthController.logout',

  'get /signup': {
    view: 'signup'
  }
};

