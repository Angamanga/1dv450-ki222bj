module.exports = {
  attributes: {
    coordinates:{
      type:'json',
      required:true
    },
    name: {
      type: 'string',
      required: true
    },
    streetAddress: {
      type: 'string',
      required: true
    },
    postalCode: {
      type: 'string',
      required: true
    },
    city: {
      //might want to check this through an api
      type: 'string',
      required: true
    },
    electricity: {
      type: 'string',
      enum: ['everywhere', 'plenty', 'some', 'nowhere']
    },
    wifi: {
      type: 'string',
      enum: ['free', 'paid', 'no']
    }
  },
    findNear:function(conditions,callback){
      this.native((err,collection)=>{
        console.log(collection);
        if(err){
          return callback(err);
        }
        collection.geoNear({
          type: 'Point',
          coordinates: [conditions.lng, conditions.lat]
        }, {
          limit: conditions.limit || 30,
          maxDistance: conditions.maxDistance,
          spherical: true
        },
          (err,places)=>{
            if(err) return callback(err);
            console.log(places)
            return callback(null, places.results);
          });
        });
       }
};

