"use strict";

const reqParams = ['latitude', 'longitude', 'name', 'streetAddress', 'postalCode', 'city', 'electricity', 'wifi', 'email'];
module.exports = {
  'create'(req, res, next){
    //creates or updates a cafe depending on if an id is sent with request (update) or not (create)
    let cafeObj = req.query,
      id = req.param('id'),
      errors = 'You make sure you entered:\n',
      email = new Buffer(req.headers.authorization.slice(6), 'base64').toString('ascii').split(':')[0]; //really should find a better way to make this DRY

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
      cafeObj.createdBy = email;
      delete cafeObj.longitude;
      delete cafeObj.latitude;
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
        else if (cafe.createdBy !== email) {
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
        return res.badRequest({err: 'no cafe with that ID was found'});
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
    //making more complex search depending on params included
    let searchParams = reqParams.concat('search', 'maxDistance');
    let query = req.query,
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

    if (query.longitude && query.latitude) {
    //creating an object for making geographical search in mongodb
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
      //creating an object for text-search in mongodb
      textquery = {
        $regex: query.search,
        $options: 'igm'
      };
      delete query.search;
      //searchquery if text-search is present (if the parameter "search" is included in the request).
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
      //searchquery if no text-search is present
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
            let cafeResult =[]
            //extracting relevant information and creating a response-object
            cafe.forEach(obj=>{
              cafeResult.push({location:'http://' + sails.config.HOMEPATH + '/cafeinfo/' + obj._id,cafe:obj});
            });
            let resObj = {
              message: 'cafes found',
              cafes: cafeResult
            }
            return res.json(['200'], resObj);
          }
        }

          if(geoquery){
          //if lat/long was present in the request, a geographical search is performed
            collection.geoNear(geoquery,{
              maxDistance:maxDistance,
              spherical:true,
              query:searchquery
            },(err,results)=>{
              callback(err,results.results);
            });
          }
        else{
            //no lat/long was present, a 'normal' search is performed
            collection.find(searchquery).sort({createdAt: -1}).skip(offset).limit(limit).toArray(callback);
          }
      });
    },
  destroy(req, res, next){
    //deleting a cafe
      let id = req.param('id'),
      email = new Buffer(req.headers.authorization.slice(6), 'base64').toString('ascii').split(':')[0]; //really should find a better way to make this DRY

    Cafeinfo.findOne({id:id}).exec((err, cafe)=> {
        if(!cafe){
          return res.badRequest({err:'no cafe with your id: '+ id +' was found'});
        }
        else if (cafe.createdBy === email) {
        Cafeinfo.destroy({id: id}).exec((err, response)=> {
          res.send([200], {message:'cafe with id: ' + id + ' was removed', deletedInfo:response});
        });
      }
      else{
          res.forbidden({message:'you are not allowed to remove this cafe'});
        }
    });

  }
  //add tags!?
  //change auth to header
  //change auth to auth-token, similar to this: https://thesocietea.org/2015/04/building-a-json-api-with-rails-part-4-implementing-authentication/
  //add readme
  //deploy...
}
