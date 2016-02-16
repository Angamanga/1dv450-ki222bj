module.exports = {
  attributes: {
    application:{
      name:'string',
      apikey:'string',
      required:true,
      size:16
    },
    user:{
      model:'User',
      required:true
    }
  }
};

