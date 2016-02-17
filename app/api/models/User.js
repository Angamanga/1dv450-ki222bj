module.exports = {
  schema: true,
  attributes: {
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


