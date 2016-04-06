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
      enum: ['everywhere', 'plenty', 'some', 'nowhere'],
      required:true
    },
    wifi: {
      type: 'string',
      enum: ['free', 'paid', 'no'],
      required:true
    },
    createdBy:{
      type:'string',
      required:true
    }
  }

};

