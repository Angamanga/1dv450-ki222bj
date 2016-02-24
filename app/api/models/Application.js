"use strict";
//model for applications
module.exports = {
  attributes: {
    name:{
      type:'string',
    },
    description:{
      type:'string',
    },
    userId:{
      model:'user'
    },
    apiKey:{
      type:'string',
      size:10
    }
  }
};


