"use strict";

module.exports = {
  schema: true,
  attributes: {
    name:{
      type:'string'
    },
    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },
    encryptedPassword: {
      type: 'string'
    },
    toJSON(){
      let obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
    }
  },
  beforeCreate(values,next){
    if(!values.password || values.password !== values.confirmation){
      return(next({err:['Passwords does not match password confirmation']}));
    }
    require('bcrypt').hash(values.password, 10, (err, encryptedPassword)=>{
      if(err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });
    }
};


