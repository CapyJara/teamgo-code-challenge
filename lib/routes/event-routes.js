const router = require('express').Router();
const Event = require('../models/Event');
const { ensureAuth } = require('../middleware/ensure-auth');

const returnErr = (message, next) => {
  return Promise.reject({
    statusCode: 400,
    error: message
  })
    .catch(next);
};

const pagingInfo = async(query, search) => {
  let { page, perpage } = query;
  if(page === undefined) page = 1;
  if(perpage === undefined) perpage = 50;
  const docs = await Event.countDocuments(search);
  const pages = Math.ceil(docs / perpage);
  return {
    page: Number(page),
    pages: Number(pages),
    perpage: Number(perpage)
  };
};

router
  .post('/', ensureAuth(), async(req, res, next) => {
    const { name, description, eventDate, state, city, address } = req.body; 
    if(!name || !description || !eventDate || !state || !city || !address) await returnErr('Name, Description, state, city, address and EventDate required', next);
    
    // eslint-disable-next-line require-atomic-updates
    req.body.organizer = req.user.id;
    return await Event.create(req.body)
      .then(newEvent => res.send(newEvent))
      .catch(next);
  })
  .get('/', async(req, res, next) => {
    let { state, city, start, end } = req.query;
    
    if(state === undefined) state = null;
    if(city === undefined) city = null;
    if(start === undefined) start = null;
    if(end === undefined) end = null;
    
    if(city && !state) await returnErr('If searching by city, include state', next);
    if(start && !end || end && !start) await returnErr('If searching by date, include start and end dates', next);    
    
    // eslint-disable-next-line no-useless-escape
    const regex = RegExp('\d{4}-\d{2}-\d{2}');
    if(start && (regex.test(start) || regex.test(end))) await returnErr('Enter dates in yyyy-mm--dd format', next);
    
    let search = {};
    if(state) search.state = state;
    if(city) search.city = city;
    if(start) {
      search.eventDate = { 
        $gte : new Date(start), 
        $lt : new Date(end) 
      };
    }
    
    const paging = await pagingInfo(req.query, search);
    return await Event
      .find(search)
      .lean()
      .skip((paging.page - 1) * paging.perpage)
      .limit(paging.perpage)
      .then(events => res.send({ paging, events }))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    return Event
      .findById(req.params.id)
      .lean()
      .then(event => res.send(event))
      .catch(next);
  })
  .put('/attend/:eventId', ensureAuth(), (req, res, next) => {
    return Event
      .findByIdAndUpdate(req.params.eventId, 
        { $addToSet: { attendees: req.user.id }, }, 
        { new: true })
      .lean()
      .then(event => res.send(event))
      .catch(next);
  })
  .put('/update/:eventId', ensureAuth(), async(req, res, next) => {
    const event = Event.findById(req.params.eventId);
    if(!event) await returnErr('Invalid event id', next);
    if(event.organizer !== req.user.is) await returnErr('You do not have permission do update this event', next);
    return Event
      .findByIdAndUpdate(req.params.eventId, 
        req.body, 
        { new: true })
      .lean()
      .then(updatedEvent => res.send(updatedEvent))
      .catch(next);
  })
;

module.exports = router;
