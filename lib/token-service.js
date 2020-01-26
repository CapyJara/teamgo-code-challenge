const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);
const APP_SECRET = process.env.APP_SECRET;

module.exports = {
  sign(user) {
    const payload = {
      id: user._id
    };

    return sign(payload, APP_SECRET);
  },
  verify(token) {
    return verify(token, APP_SECRET);
  }
};
