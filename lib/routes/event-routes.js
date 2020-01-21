const router = require('express').Router();
const Event = require('../models/event');
const { ensureAuth } = require('../middleware/ensure-auth');

router
  .post('/', ensureAuth(), (req, res, next) => {
    const { name, description, organizer, eventDate } = req.body; 

    if(!name || !description || !organizer || !eventDate) {
      return Promise.reject({
        statusCode: 400,
        error: 'Name, Description, Organizer, and EventDaterequired'
      });
    }
    return Event.create(req.body)
      .then(newEvent => res.send(newEvent))
      .catch(next);
  })

;

module.exports = router;
