"use strict";

module.exports = {
  'create'(req, res, next){
    let cafeObj = {};
    cafeObj.latitude = req.param('latitude');
    cafeObj.longitude = req.param('longitude');
    cafeObj.name = req.param('name');
    cafeObj.streetAddress = req.param('streetAddress');
    cafeObj.postalCode = req.param('postalCode');
    cafeObj.city = req.param('city');
    cafeObj.electricity = req.param('electricity');
    cafeObj.wifi = req.param('wifi');

    Cafeinfo.create(cafeObj,(err,obj)=>{
      if(err){
        return res.forbidden(err);
      }
      else{
        return res.send(['200'], 'your cafe was added! The unique id is ' + obj.id);
      }
    });
  },
  'show'(req,res,next){
    Cafeinfo.findOne({id:req.id}).exec((err,cafe)=>{
      if(err){
        return res.badRequest('no cafe with that id was found');
      }
      else{
        return res.send(['200'], cafe);
      }
    });
  }
};

