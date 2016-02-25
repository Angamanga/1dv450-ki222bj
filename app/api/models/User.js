"use strict";
//model for User
module.exports = {
  schema: true,
  attributes: {
    name: {
      type: 'string'
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
    admin: {
      type: 'boolean',
      defaultsTo: true
    },
    applications: {
      collection: 'application',
      via: 'userId'
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
  beforeValidation(values, next){
    if (typeof values.admin !== 'undefined') {
      if (values.admin === 'unchecked') {
        values.admin = false;
      }
      else if (values.admin[1] === 'on') {
        values.admin = true;
      }
    }
    next();
  },
  beforeCreate(values, next){
    //checking and hashing password
    if (!values.password || values.password !== values.confirmation) {
      return (next({err: ['Passwords does not match password confirmation']}));
    }
    require('bcrypt').hash(values.password, 10, (err, encryptedPassword)=> {
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });
  }
};


