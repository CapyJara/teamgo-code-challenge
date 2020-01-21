const router = require('express').Router();
const Event = require('../models/event');
const { ensureAuth } = require('../middleware/ensure-auth');

router
  .post('/', ensureAuth(), (req, res, next) => {
    const { name, description, organizer, eventDate, state, city, address } = req.body; 

    if(!name || !description || !organizer || !eventDate || !state || !city || !address) {
      return Promise.reject({
        statusCode: 400,
        error: 'Name, Description, Organizer, state, city, address and EventDate required'
      });
    }
    return Event.create(req.body)
      .then(newEvent => res.send(newEvent))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    return Event.find()
      .then(events => res.send(events))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    return Event.findById(req.params.id)
      .then(event => res.send(event))
      .catch(next);
  })
;

module.exports = router;
