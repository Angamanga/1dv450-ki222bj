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
    }
  }
};


