const { Router } = require('express');
const Mod = require('../models/Mod');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { name } = req.body;
    Mod
      .create({ name })
      .then(mod => res.send(mod))
      .catch(next);
  });
