const router = require('express').Router();
const seed = require('../utils/seedData');

router
  .get(`/${process.env.SEED_KEY}`, async(req, res, next) => {
    seed(1000, 20, 2000);
    res.send({ message: 'Database is being seeded! Please wait a few minutes for it to finish' })
      .catch(next);
  });

module.exports = router;
