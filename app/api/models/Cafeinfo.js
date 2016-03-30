module.exports = {
  attributes: {
    latitude: {
      type: 'string',
      required: true
    },
    longitude: {
      type: 'string',
      required: true
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
  }
};

