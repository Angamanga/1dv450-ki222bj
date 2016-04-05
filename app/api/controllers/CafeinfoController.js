"use strict";
module.exports = {
  'create'(req, res, next){
    let cafeObj = {},
      errors = 'You make sure you entered:\n';

    //TODO: refactor below in own function
    if (parseFloat(req.param('longitude')) && parseFloat(req.param('latitude'))) {
      cafeObj.coordinates = [parseFloat(req.param('longitude')), parseFloat(req.param('latitude'))];
    }
    else {
      errors += 'latitude and longitude\n';
    }
    req.param('name') ? cafeObj.name = req.param('name') : errors += 'name\n';
    req.param('streetAddress') ? cafeObj.streetAddress = req.param('streetAddress') : errors += 'streetAddress\n';
    req.param('postalCode') ? cafeObj.postalCode = req.param('postalCode') : errors += 'postalCode\n';
    req.param('city') ? cafeObj.city = req.param('city') : errors += 'city\n';
    req.param('electricity') ? cafeObj.electricity = req.param('electricity') : errors += 'electricity \n';
    req.param('wifi') ? cafeObj.wifi = req.param('wifi') : errors += 'wifi';

    if (errors.length > 27) {
      return res.badRequest(errors);
    }

    Cafeinfo.create(cafeObj, (err, obj)=> {
      if (err) {
        return res.forbidden(err);
      }
      else {
        return res.send(['200'], 'your cafe was added! The unique id is ' + obj.id);
      }
    });
  },
  'show'(req, res, next){
    let query = {},
      location = {},
      limit;

    //todo: refactor below in own function
    req.param('id') ? query.id = req.param('id') : null;
    req.param('name') ? query.name = (req.param('name')) : null;
    req.param('streetAddress') ? query.streetAddress = req.param('streetAddress') : null;
    req.param('postalCode') ? query.postalCode = req.param('postalCode') : null;
    req.param('city') ? query.city = req.param('city') : null;
    req.param('electricity') ? query.electricity = req.param('electricity') : null;
    req.param('wifi') ? query.wifi = req.param('wifi') : null;
    req.param('limit') ? limit = req.param('limit') : null;

    Cafeinfo.native((err, collection)=> {
      collection.find(query).sort(-1).toArray((err, cafe)=> {
        console.log(err);
        if (err) {
          return res.negotiate(err);
        }
        else if (!cafe) {
          return res.badRequest('no cafe with your search-criteria was found');
        }
        else {
          return res.json(['200'],cafe);
        }
      });
    });
  },
  'findNear'(req, res){
    let query = {};
    //https://github.com/balderdashy/sails-mongo/issues/46
    if (req.param('latitude') && req.param('longitude')) {
      //regex for lat/long!
      query.lng = parseFloat(req.param('longitude'));
      query.lat = parseFloat(req.param('latitude'));
      query.maxDistance = parseFloat(req.param('distance')) || 500;
      Cafeinfo.findNear(query, (err, results)=> {
        if (err) {
          return res.negotiate(err);
        }
        else if (results.length < 1) {
          return res.send(['200'], 'no cafe with your search-criteria was found');
        }
        return res.json(['200'], results);
      });
    }
    else {
      return res.badRequest('you must enter latitude and longitude to make a query');
    }
  },
  'badRequest'(req, res, next){
    return res.badRequest('Invalid request');
  }
};

