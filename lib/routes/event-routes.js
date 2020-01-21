const router = require('express').Router();
const Event = require('../models/Event');
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
  .get('/location/state/:state', (req, res, next) => {
    return Event.find(req.params)
      .then(events => res.send(events))
      .catch(next);
  })
  .get('/location/state/:state/city/:city', (req, res, next) => {
    return Event.find(req.params)
      .then(events => res.send(events))
      .catch(next);
  })
  .get('/date/:start/:end', (req, res, next) => {
    const { start, end } = req.params;
    // eslint-disable-next-line no-useless-escape
    const regex = RegExp('\d{4}-\d{2}-\d{2}');
    if(start === end) {
      return Promise.reject({
        statusCode: 400,
        error: 'If searching for single day, end day should be day after start day'
      });
    }
    if(regex.test(start) || regex.test(end)) {
      return Promise.reject({
        statusCode: 400,
        error: 'Enter dates in yyyy-mm--dd format'
      });
    }
    if(!start || !end) {
      return Promise.reject({
        statusCode: 400,
        error: 'Start and End date require'
      });
    }
    return Event
      .dateRange(start, end)
      .then(events => res.send(events))
      .catch(next);
  })
  .put('/attend/:eventId', ensureAuth(), (req, res, next) => {
    return Event
      .findByIdAndUpdate(req.params.eventId, 
        { $addToSet: { attendees: req.user.id }, }, 
        { new: true })
      .then(event => res.send(event))
      .catch(next);
  })
  .put('/update/:eventId', ensureAuth(), async(req, res, next) => {
    const event = Event.findById(req.params.eventId);
    if(!event) {
      return Promise.reject({
        statusCode: 400,
        error: 'Invalid event id'
      });
    }
    if(event.organizer !== req.user.is) {
      return Promise.reject({
        statusCode: 400,
        error: 'You do not have permission do update this event'
      });
    }
    return Event
      .findByIdAndUpdate(req.params.eventId, 
        req.body, 
        { new: true })
      .then(updatedEvent => res.send(updatedEvent))
      .catch(next);
  })
;

module.exports = router;
