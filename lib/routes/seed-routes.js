const router = require('express').Router();
const seed = require('../utils/seedData');

// calls a function to seed the database,
//    but does not wait till its finished to send a response
router
  .get(`/${process.env.SEED_KEY}`, async(req, res, next) => {
    seed(1000, 20, 2000);
    Promise.resolve(res.send({ message: 'Database is being seeded! Please wait a few minutes for it to finish' }))
      .catch(next);
  });

module.exports = router;
