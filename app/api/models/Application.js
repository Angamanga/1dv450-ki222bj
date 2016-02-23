"use strict";
module.exports = {
  attributes: {
    name:{
      type:'string',
      required:true,
    },
    description:{
      type:'string',
      required:true,
      size:100
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


