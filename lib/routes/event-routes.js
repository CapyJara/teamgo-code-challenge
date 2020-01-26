const router = require('express').Router();
const Event = require('../models/Event');
const { ensureAuth } = require('../middleware/ensure-auth');

const returnErr = (message, next) => {
  return Promise.reject({
    statusCode: 500,
    error: message
  })
    .then(next({ message }));
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
    perpage: Number(perpage),
    totalDocs: docs
  };
};

router
  .post('/', ensureAuth(), async(req, res, next) => {
    const { name, description, eventDate, state, city, address } = req.body; 
    if(!name || !description || !eventDate || !state || !city || !address) {
      await returnErr('Name, Description, state, city, address and EventDate required', next);
    }
    
    const event = {
      ...req.body,
      organizer: req.user.id
    };
    return await Event.create(event)
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
    const regex = RegExp(/\d{4}-\d{2}-\d{2}/);
    if(start && !(regex.test(start) || regex.test(end))) await returnErr('Enter dates in yyyy-mm-dd format', next);
    
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
  .get('/:id', async(req, res, next) => {
    let event;
    try { 
      event = await Event
        .findById(req.params.id)
        .lean();
    }
    catch(e) { await returnErr('No event matching id', next); }
    return res.send(event);
  })
  .put('/attend/:eventId', ensureAuth(), async(req, res, next) => {
    let event;
    try { 
      event = await Event
        .findByIdAndUpdate(req.params.eventId, 
          { $addToSet: { attendees: req.user.id }, }, 
          { new: true })
        .lean();
    }
    catch(e) { await returnErr('No event matching id', next); }
    return res.send(event);
  })
  .put('/update/:eventId', ensureAuth(), async(req, res, next) => {
    let event;
    try { 
      event = await Event
        .findById(req.params.eventId)
        .lean();
    }
    catch(e) { await returnErr('No event matching id', next); }

    if(String(event.organizer) !== req.user.id) await returnErr('You do not have permission do update this event', next);
    return res.send(event);
  })
;

module.exports = router;
