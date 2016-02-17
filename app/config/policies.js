module.exports.policies = {
  '*': true,
  'PostController': {
    restricted:['sessionAuth'],
    open:true
  },
};
