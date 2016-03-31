module.exports.policies = {

//Setting policies to controller-methods

  '*': 'flash',
  user: {
    'new': 'flash',
    'create': 'flash',
    'show': 'userCanSeeProfile',
    'edit': 'userCanSeeProfile',
    'update': 'userCanSeeProfile',
    '*': 'admin'
  },
  application: {
    'create': 'applications',
    'show': 'applications',
    'edit': 'applications',
    'update': 'applications',
    'destroy': 'applications',
    'cancel': 'applications',
    '*': 'admin'
  },
  cafeinfo:{
    'create':['apiAuth','apiKey'],
    'show':'apiKey'
    //'edit':'apiKey',
    //'destroy':'apiKey'
  }
};
