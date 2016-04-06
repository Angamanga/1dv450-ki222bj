"use strict";

const reqParams = ['latitude', 'longitude', 'name', 'streetAddress', 'postalCode', 'city', 'electricity', 'wifi', 'email'];
module.exports = {
  'create'(req, res, next){
    //creates or updates a cafe depending on if an id is sent with request (update) or not (create)
    let cafeObj = req.query,
      id = req.param('id'),
      errors = 'You make sure you entered:\n';

    //deleting unwanted parameters
    Object.keys(cafeObj).forEach(key=> {
      if (reqParams.indexOf(key) === -1) {
        delete cafeObj[key];
      }
    });
    //creating new cafe
    if (!id) {
      reqParams.forEach(key=> {
        if (!cafeObj[key]) {
          errors += key + '\n';
        }
      });

      if (errors.length > 27) {
        return res.badRequest(errors);
      }

      cafeObj.coordinates = [parseFloat(cafeObj.longitude), parseFloat(cafeObj.latitude)];
      cafeObj.createdBy = cafeObj.email;
      delete cafeObj.longitude;
      delete cafeObj.latitude;
      delete cafeObj.email;
      Cafeinfo.create(cafeObj, (err, obj)=> {
        if (err) {
          return res.negotiate(err);
        }
        else {
          res.location('/cafeinfo/' + obj.id);
          return res.send(['201'], 'your cafe was added! Location: http://' + sails.config.HOMEPATH + '/cafeinfo/' + obj.id);
        }
      });
    }
    //updating existing cafe
    else {
      Cafeinfo.findOne({id: id}).exec((err, cafe)=> {
        if (err) return res.negotiate(err);
        else if (!cafe) return res.badRequest('no cafe with that ID was found');
        //checking that updator is the same as creator (extra check, authorization is already done in policies/apiAuth)
        else if (cafe.createdBy !== cafeObj.email) {
          return res.forbidden('You are not allowed to edit this cafe');
        }
        else {
          //preparing object for update
          delete cafeObj.email;
          Cafeinfo.update({id: id}, cafeObj).exec((err, obj)=> {
            if (err) return res.negotiate(err);
            res.location('/cafeinfo/' + obj[0].id);
            return res.send(['200'], 'your cafe was successfully updated. Please check: http://' + sails.config.HOMEPATH + '/cafeinfo/' + obj[0].id);
          });
        }
      });
    }
  },
  'showOne'(req, res, next){
    //looking for one cafe with provided id
    Cafeinfo.findOne({id: req.param('id')}).exec((err, cafe)=> {
      console.log(cafe);
      if (err) return res.negotiate(err);
      else if (!cafe) {
        let resObj = {
          err: 'no cafe with that ID was found'
        }
        return res.badRequest(resObj);
      }
      else {
        let resObj = {
          message: 'cafe found',
          location: 'http://' + sails.config.HOMEPATH + '/cafeinfo/' + cafe.id,
          cafe: cafe
        }
        res.location('/cafeinfo/' + cafe.id);
        return res.send(['200'], resObj);
      }
    });
  },
  'show'(req,res,next){
    let searchParams = reqParams.concat('search', 'maxDistance');
    let query = req.query,
      geoquery,
      textquery,
      searchquery,
      limit = req.param('limit') || 25,
      offset = req.param('offset') || 0,
      maxDistance;
    Object.keys(query).forEach(key=> {
      if (searchParams.indexOf(key) === -1) {
        delete query[key];
      }
    });

    if (query.longitude && query.latitude) {
      //regex for lat/long?
      geoquery = {
        type:'Point',
        coordinates:[parseFloat(query.longitude), parseFloat(query.latitude)]
      };
      maxDistance = query.maxDistance || 500;
      delete query.longitude;
      delete query.latitude;
      delete query.maxDistance;
      console.log(geoquery);
    }
    else if (query.latitude || query.longitude) {
      return res.badRequest({err: 'you must enter latitude and longitude to make a geographical query'});
    }

    if (query.search) {
      textquery = {
        $regex: query.search,
        $options: 'igm'
      };
      delete query.search;

      searchquery = {
        $and: [
          query,
          {
            $or: [
              {name: textquery},
              {streetAddress: textquery},
              {postalCode: textquery},
              {city: textquery},
              {electricity: textquery},
              {wifi: textquery},
              {createdBy: textquery},
              {createdAt: textquery},
              {updatedAt: textquery}
            ]
          }
        ]
      };
    }
    else {
      searchquery = query;
    }

      Cafeinfo.native((err, collection)=> {
        let callback = (err, cafe)=> {
          if (err) {
            return res.negotiate(err);
          }
          else if (!cafe) {
            return res.badRequest('no cafe with your search-criteria was found');
          }
          else {
            return res.json(['200'], cafe);
          }
        }
          if(geoquery){
            collection.geoNear(geoquery,{
              maxDistance:maxDistance,
              spherical:true,
              query:searchquery
            },(err,places)=>{
              //this is working!
              console.log(places.results);
            });
              //);
          }
        else{
            collection.find(searchquery).sort({createdAt: -1}).skip(offset).limit(limit).toArray(callback);
          }
      });
    }
}


//    collection.geoNear({
//        type: 'Point',
//        coordinates: [conditions.lng, conditions.lat]
//      }, {
//        limit: conditions.limit || 30,
//        maxDistance: conditions.maxDistance,
//        spherical: true
//      },
//      (err,places)=>{
//        if(err) return callback(err);
//        console.log(places)
//        return callback(null, places.results);
//      });
//  });
//}
//
//'show'(req, res, next){
//  let query = {},
//    location = {},
//    limit,
//    offset;
//
//  //todo: refactor below in own function
//  req.param('id') ? query.id = req.param('id') : null;
//  req.param('name') ? query.name = (req.param('name')) : null;
//  req.param('streetAddress') ? query.streetAddress = req.param('streetAddress') : null;
//  req.param('postalCode') ? query.postalCode = req.param('postalCode') : null;
//  req.param('city') ? query.city = req.param('city') : null;
//  req.param('electricity') ? query.electricity = req.param('electricity') : null;
//  req.param('wifi') ? query.wifi = req.param('wifi') : null;
//  limit = parseInt(req.param('limit')) ?  parseInt(req.param('limit')) : 30;
//  offset = parseInt(req.param('offset')) ? parseInt(req.param('offset')) : 0;
//
//  Cafeinfo.native((err, collection)=> {
//    let callback = (err, cafe)=> {
//      if (err) {
//        return res.negotiate(err);
//      }
//      else if (!cafe) {
//        return res.badRequest('no cafe with your search-criteria was found');
//      }
//      else {
//        return res.json(['200'], cafe);
//      }
//    }
//    collection.find(query).sort({createdAt: -1}).skip(offset).limit(limit).toArray(callback);
//
//  });
//},
//'findNear'(req, res){
//  let query = {};
//  //https://github.com/balderdashy/sails-mongo/issues/46
//  if (req.param('latitude') && req.param('longitude')) {
//    //regex for lat/long!
//    query.lng = parseFloat(req.param('longitude'));
//    query.lat = parseFloat(req.param('latitude'));
//    query.maxDistance = parseFloat(req.param('distance')) || 500;
//    Cafeinfo.findNear(query, (err, results)=> {
//      if (err) {
//        return res.negotiate(err);
//      }
//      else if (results.length < 1) {
//        return res.send(['200'], 'no cafe with your search-criteria was found');
//      }
//      return res.json(['200'], results);
//    });
//  }
//  else {
//    return res.badRequest('you must enter latitude and longitude to make a query');
//  }
//},
//'search'(req,res){
//  let searchObj = {
//    $regex: req.param('search'),
//    $options: 'igm'
//  };
//  let query = {
//    $or: [{
//      coordinates:searchObj,
//      name:searchObj,
//      streetAddress:searchObj,
//      postalCode: searchObj,
//      city:searchObj,
//      electricity:searchObj,
//      wifi: searchObj
//    }]
//  };
//
//  Cafeinfo.native((err, collection)=> {
//    collection.find(query).sort({createdAt: -1}).toArray(function (err, result) {
//      if (err) {
//        res.send(err);
//      } else {
//        res.json(result);
//      }
//    });
//  });
//},
