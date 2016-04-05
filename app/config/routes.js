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
  },
  'get /cafeinfo':{
    controller:'CafeinfoController',
    action:'show'
},
  'get /cafeinfo/create':{
    controller:'CafeinfoController',
    action:'badRequest'
  },
  'post /cafeinfo/create':{
    controller:'CafeinfoController',
    action:'create'
  },
  'get /cafeinfo/near':{
    controller:'CafeinfoController',
    action:'findNear'
  }
};
