"use strict";
const _ = require('lodash');

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
    let query = {},
      distance;

    //todo: refactor 27-32 in own function
    req.param('name') ? query.name = (req.param('name')) : null;
    req.param('streetAddress') ? query.streetAddress = req.param('streetAddress') : null;
    req.param('postalCode') ? query.postalCode = req.param('postalCode') : null;
    req.param('city') ? query.city = req.param('city') : null;
    req.param('electricity') ? query.electricity = req.param('electricity') : null;
    req.param('wifi') ? query.wifi = req.param('wifi') : null;
    req.param('latitude') ? query.latitude = req.param('latitude') : null;
    req.param('longitude') ? query.longitude = req.param('longitude') : null;
    req.param('distance') ? distance = req.param('distance') : 500;
  //https://github.com/balderdashy/sails-mongo/issues/46

    Cafeinfo.find(query).exec((err,cafe)=>{
      if(err){
        return res.badRequest('no cafe with that id was found');
      }
      else{
        return res.send(['200'], _.orderBy(cafe, ['createdAt'], ['desc']));
      }
    });
  },
  'badRequest'(req,res,next){
    return res.badRequest('Invalid request');
  }
};

