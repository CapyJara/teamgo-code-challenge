const router = require('express').Router();
const Event = require('../models/event');
const { ensureAuth } = require('../middleware/ensure-auth');

router
  .post('/', ensureAuth(), (req, res, next) => {
    const { name, description, eventDate, state, city, address } = req.body; 
    if(!name || !description || !eventDate || !state || !city || !address) {
      return Promise.reject({
        statusCode: 400,
        error: 'Name, Description, state, city, address and EventDate required'
      });
    }
    req.body.organizer = req.user.id;
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
  .post('/location', (req, res, next) => {
    const { state, city } = req.body;

    let searchParams = { state };
    if(city) searchParams.city = city;
    if(city && !state) {
      return Promise.reject({
        statusCode: 400,
        error: 'If searching by city, state required'
      });
    }
    return Event.find(searchParams)
      .then(events => res.send(events))
      .catch(next);
  })
;

module.exports = router;
