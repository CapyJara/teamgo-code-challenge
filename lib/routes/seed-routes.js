const router = require('express').Router();
const mongoose = require('mongoose');
const seed = require('../utils/seedData');

router
  .get(`/${process.env.SEED_KEY}`, async(req, res, next) => {
    await mongoose.connection.dropDatabase();
    return await seed(1000, 20, 2000)
      .then(() => res.send({ message: 'Database seeded!' }))
      .catch(next);
  });

module.exports = router;
