"use strict";

const reqParams = ['latitude', 'longitude', 'name', 'streetAddress', 'postalCode', 'city', 'electricity', 'wifi'];
module.exports = {
  /*'create'-function creates or updates a cafe depending on if an id is sent with request (update) or not (create)*/
  'create'(req, res, next){
    let cafeObj = req.query,
      id = req.param('id'),
      errors = 'You make sure you entered:\n',
      email = new Buffer(req.headers.authorization.slice(6), 'base64').toString('ascii').split(':')[0]; //really should find a better way to make this DRY

    /*deleting unwanted parameters*/
    Object.keys(cafeObj).forEach(key=> {
      if (reqParams.indexOf(key) === -1) {
        delete cafeObj[key];
      }
    });
    /*creating new cafe*/
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
      cafeObj.createdBy = email;
      delete cafeObj.longitude;
      delete cafeObj.latitude;
      Cafeinfo.create(cafeObj, (err, obj)=> {
        if (err) {
          return res.negotiate(err);
        }
        else {
          res.location('/cafeinfo/' + obj.id);
          return res.send(['201'], {
            message: 'your cafe was added!',
            location: 'http://' + sails.config.HOMEPATH + '/cafeinfo/' + obj.id,
            savedCafe: obj
          });
        }
      });
    }
    /*updating existing cafe*/
    else {
      Cafeinfo.findOne({id: id}).exec((err, cafe)=> {
        if (err) return res.negotiate(err);
        else if (!cafe) return res.badRequest({message: 'no cafe with that ID was found'});
        //checking that updater is the same as creator (extra check, authorization is already done in policies/apiAuth)
        else if (cafe.createdBy !== email) {
          return res.forbidden({message: 'You are not allowed to edit this cafe'});
        }
        else {
          cafeObj.coordinates = cafe.coordinates;
          if(cafeObj.longitude){
            cafeObj.coordinates[0] = parseFloat(cafeObj.longitude);
            delete cafeObj.longitude;
          }
          if(cafeObj.latitude){
            cafeObj.coordinates[1] = parseFloat(cafeObj.latitude);
            delete cafeObj.latitude;
          }

          Cafeinfo.update({id: id}, cafeObj).exec((err, obj)=> {
            if (err) return res.negotiate(err);
            res.location('/cafeinfo/' + obj[0].id);
            return res.send(['200'], {
              message: 'your cafe was successfully updated.',
              Location: 'http://' + sails.config.HOMEPATH + '/cafeinfo/' + obj[0].id,
              updatedCafe: obj[0]
            });
          });
        }
      });
    }
  },
  /*'showOne'-function displays one cafe with a specific id provided in the request*/
  'showOne'(req, res, next){
    Cafeinfo.findOne({id: req.param('id')}).exec((err, cafe)=> {
      if (err) return res.negotiate(err);
      else if (!cafe) {
        return res.badRequest({err: 'no cafe with that ID was found'});
      }
      else {
        res.location('/cafeinfo/' + cafe.id);
        return res.send(['200'], {
          message: 'cafe found',
          location: 'http://' + sails.config.HOMEPATH + '/cafeinfo/' + cafe.id,
          cafe: cafe
        });
      }
    });
  },
  /*'show'-function is making more complex search depending on request-params included*/
  'show'(req, res, next){
    let searchParams = reqParams.concat('search', 'maxDistance', 'createdBy'),
      query = req.query,
      geoquery,
      textquery,
      searchquery,
      limit = req.param('limit') || 25,
      offset = req.param('offset') || 0,
      maxDistance;

    Object.keys(query).forEach(key=> {
      //deleting unrelevant parameters
      if (searchParams.indexOf(key) === -1) {
        delete query[key];
      }
    });
    /*if both longitude and latitude is present in the request an object for making geographical search in mongodb is created below */
    if (query.longitude && query.latitude) {
      geoquery = {
        type: 'Point',
        coordinates: [parseFloat(query.longitude), parseFloat(query.latitude)]
      };
      maxDistance = parseFloat(query.maxDistance) || 500;
      delete query.longitude;
      delete query.latitude;
      delete query.maxDistance;
    }
    else if (query.latitude || query.longitude) {
      return res.badRequest({err: 'you must enter latitude and longitude to make a geographical query'});
    }

    /*if search-param is present in the request, an object for making free-text-search in mongodb is created below*/
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
      /*searchquery if no text-search is present*/
      searchquery = query;
    }

    Cafeinfo.native((err, collection)=> {
      let callback = (err, cafe)=> {
        if (err) {
          return res.negotiate(err);
        }
        else if (!cafe || cafe.length <1) {
          return res.badRequest({message:'no cafe with your search-criteria was found'});
        }
        else {
          let cafeResult = []
          //extracting relevant information and creating a response-object
          cafe.forEach(obj=> {
            cafeResult.push({location: 'http://' + sails.config.HOMEPATH + '/cafeinfo/' + obj._id, cafe: obj});
          });

          if(cafeResult.length>0){
          return res.json(['200'], {
            message: 'cafes found',
            cafes: cafeResult
          });
          }
          else{
              return res.badRequest({message:'no cafe with your search-criteria was found'});
            }
        }
      }

      /*if lat/long was present in the request, a geographical search is performed*/
      if (geoquery) {
        collection.geoNear(geoquery, {
          maxDistance: maxDistance,
          spherical: true,
          query: searchquery
        }, (err, results)=> {
          let cafes = [];
          if(results !== undefined){
            results.results.forEach(key=>{
              console.log(key);
              cafes.push(key.obj);
            });
          }
          callback(err, cafes);
        });
      }
      else {
        /*no lat/long was present, a 'normal' search is performed*/
        collection.find(searchquery).sort({createdAt: -1}).skip(offset).limit(limit).toArray(callback);
      }
    });
  },
  /*'destroy'-function is deleting a cafe with a specific id*/
  destroy(req, res, next){
    let id = req.param('id'),
      email = new Buffer(req.headers.authorization.slice(6), 'base64').toString('ascii').split(':')[0]; //really should find a better way to make this DRY
console.log(id);
    console.log(email);
    Cafeinfo.findOne({id: id}).exec((err, cafe)=> {
      if (!cafe) {
        return res.badRequest({err: 'no cafe with your id: ' + id + ' was found'});
      }
      else if (cafe.createdBy === email) {
        Cafeinfo.destroy({id: id}).exec((err, response)=> {
          res.send([200], {message: 'cafe with id: ' + id + ' was removed', deletedInfo: response});
        });
      }
      else {
        res.forbidden({message: 'you are not allowed to remove this cafe'});
      }
    });

  }
}
