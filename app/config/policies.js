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
    'create': 'userCanSeeProfile',
    'show': 'userCanSeeProfile',
    'edit': 'userCanSeeProfile',
    'update': 'userCanSeeProfile',
    'destroy': 'userCanSeeProfile',
    'cancel': 'userCanSeeProfile',
    '*': 'admin'
  }
};
