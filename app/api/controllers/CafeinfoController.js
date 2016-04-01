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

    //todo: refactor 29-4 in own function
    req.param('id') ? query.id = req.param('id') : null;
    req.param('name') ? query.name = (req.param('name')) : null;
    req.param('streetAddress') ? query.streetAddress = req.param('streetAddress') : null;
    req.param('postalCode') ? query.postalCode = req.param('postalCode') : null;
    req.param('city') ? query.city = req.param('city') : null;
    req.param('electricity') ? query.electricity = req.param('electricity') : null;
    req.param('wifi') ? query.wifi = req.param('wifi') : null;
    req.param('latitude') ? query.latitude = req.param('latitude') : null;
    req.param('longitude') ? query.longitude = req.param('longitude') : null;
  //https://github.com/balderdashy/sails-mongo/issues/46
    if(req.param('latitude')&&req.param('longitude')) {
      //regex for lat/long!
      let maxDistance = req.param('distance') ? req.param('distance') : 500;
      query.coordinates = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [
              parseInt(req.param('longitude')),
              parseInt(req.param('latitude'))
            ]
          },
          $maxDistance: maxDistance
        }
      }
    }
    else if(req.param('latitude') || req.param('longitude')) {
      return res.badRequest('you must enter both latitude and longitude');
    }

    Cafeinfo.native((err,collection)=>{
      collection.find(query).toArray((err,cafe)=>{
        console.log(err);
        if(err){

        return res.badRequest('no cafe with that id was found');
      }
      else{
        return res.send(['200'], _.orderBy(cafe, ['createdAt'], ['desc']));
      }
    });
  });},
  'badRequest'(req,res,next){
    return res.badRequest('Invalid request');
  }
};

