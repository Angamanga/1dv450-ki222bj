/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  restricted(req,res){
    return res.ok("if you can see this you are authenticated")
  },
  open(req,res){
    return res.ok("This action is open!");
  }

};

