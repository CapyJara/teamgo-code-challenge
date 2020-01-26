const router = require('express').Router();
const User = require('../models/User');
const tokenService = require('../token-service');

const sendUser = (res, user) => {
  return tokenService.sign(user)
    .then(token => {
      res.json({
        _id: user._id,
        email: user.email,
        token: token
      });
    });
};

const checkCredentialsExist = (email, password) => {
  if(!email || !password) {
    return Promise.reject({
      statusCode: 400,
      error: 'Email and password required'
    });
  }
  return Promise.resolve();
};

router
  .post('/signup', (req, res, next) => {
    const { email, password } = req.body;
    checkCredentialsExist(email, password)
      .then(() =>  User.exists({ email }))
      .then(exists => {
        if(exists) {
          throw {
            statusCode: 400,
            error: `Email ${email} is already in use`
          };
        }
        // eslint-disable-next-line no-useless-escape
        const validEmail = email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        if(!validEmail) {
          throw {
            statusCode: 400,
            error: `Email ${email} is not a valid email`
          };
        }
        
        return User.create(req.body);
      })
      .then(user => sendUser(res, user))
      .catch(next);
  })

  .post('/signin', (req, res, next) => {
    const { body } = req;
    const { email, password } = body;

    checkCredentialsExist(email, password)
      .then(() => {
        return User.findOne({ email });
      })
      .then(user => {
        if(!user || !user.comparePassword(password)) {
          throw {
            statusCode: 401,
            error: 'Invalid email or password'
          };
        }

        return sendUser(res, user);
      })
      .catch(next);
  });

module.exports = router;
