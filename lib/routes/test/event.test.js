require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const connect = require('../../utils/connect');
const seed = require('../../utils/seedData');
const Event = require('../../models/Event');

let user;
beforeAll(() => connect());
beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(async() => {
  await seed(50, 5, 25);
  return request(app)
    .post('/api/v1/user/signup')
    .send({ email: 'jared@jared.com', password: 'chisel' })
    .then(jared => user = jared.body);
});

afterAll(() => mongoose.connection.close());

const event = {
  name: 'polar plunge',
  description: 'jumps in the lake',
  organizer: new mongoose.Types.ObjectId,
  eventDate: new Date('2020-02-11'),
  state: 'ny',
  city: 'queensbury',
  address: '21 lakeview dr'
};
const createEvent = (event) => {
  return request(app)
    .post('/api/v1/event')
    .set({ Authorization: user.token })
    .send(event)
    .then(res => res.body);
};

describe('event route tests', () => {

  it('creates new event', async() => {
    return createEvent(event)
      .then(res => {
        const { name, description, organizer, attendees, eventDate, createdAt, state, city, address } = res;
        expect(name).toEqual(event.name);
        expect(description).toEqual(event.description);
        expect(organizer).toEqual(expect.any(String));
        expect(attendees).toEqual(expect.any(Array));
        expect(eventDate).toEqual(expect.any(String));
        expect(createdAt).toEqual(expect.any(String));
        expect(state).toEqual(event.state.toUpperCase());
        expect(city).toEqual(event.city.toUpperCase());
        expect(address).toEqual(event.address.toUpperCase());
      });
  });

  it('gets all events', async() => {
    return await request(app)
      .get('/api/v1/event')
      .then(res => {
        expect(res.body.length).toEqual(50);
        const { name, description, organizer, attendees, eventDate, createdAt, state, city, address } = res.body[0];
        expect(name).toEqual(expect.any(String));
        expect(description).toEqual(expect.any(String));
        expect(organizer).toEqual(expect.any(String));
        expect(attendees).toEqual(expect.any(Array));
        expect(eventDate).toEqual(expect.any(String));
        expect(createdAt).toEqual(expect.any(String));
        expect(state).toEqual(expect.any(String));
        expect(city).toEqual(expect.any(String));
        expect(address).toEqual(expect.any(String));
      });
  });

  it('gets event by id', async() => {
    const eventOne = await createEvent(event);
    return request(app)
      .get(`/api/v1/event/${eventOne._id}`)
      .then(res => {
        const { name, description, organizer, attendees, eventDate, createdAt, state, city, address } = res.body;
        expect(name).toEqual(event.name);
        expect(description).toEqual(event.description);
        expect(organizer).toEqual(expect.any(String));
        expect(attendees).toEqual(expect.any(Array));
        expect(eventDate).toEqual(expect.any(String));
        expect(createdAt).toEqual(expect.any(String));
        expect(state).toEqual(event.state.toUpperCase());
        expect(city).toEqual(event.city.toUpperCase());
        expect(address).toEqual(event.address.toUpperCase());
      });
  });

  it('gets event by state', async() => {
    return await request(app)
      .get('/api/v1/event/location/state/or')
      .then(res => {
        const states = [...new Set(res.body.map(i => i.state))];
        expect(states).toHaveLength(1);
      });
  });

  it('gets event by state and city', async() => {
    return await request(app)
      .get('/api/v1/event/location/state/or/city/portland')
      .then(res => {
        const states = [...new Set(res.body.map(i => i.state))];
        const cities = [...new Set(res.body.map(i => i.city))];
        expect(states).toHaveLength(1);
        expect(cities).toHaveLength(1);
      });
  });

  it('gets events in date range', async() => {
    const polarPlunge = await createEvent(event);
    return await request(app)
      .get('/api/v1/event/date/2020-02-10/2020-02-12')
      .then(res => {
        const eventNames = res.body.map(i => i.name);
        expect(eventNames.includes(polarPlunge.name)).toBeTruthy();
      });
  });

  it('attend an event', async() => {
    const event = await Event.findOne();
    return await request(app)
      .put(`/api/v1/event/attend/${event._id}`)
      .set({ Authorization: user.token })
      .then(res => {
        expect(res.body.attendees.includes(user._id)).toBeTruthy();
      });
  });
  
  it('organizer can update their own event', async() => {
    const polarPlunge = await createEvent(event);
    return await request(app)
      .put(`/api/v1/event/update/${polarPlunge._id}`)
      .send({ state: 'or', city: 'portland', address: '4510 ne going' })
      .set({ Authorization: user.token })
      .then(({ body }) => {
        expect(body.state).toEqual('OR');
        expect(body.city).toEqual('PORTLAND');
        expect(body.address).toEqual('4510 NE GOING');
      });
  });
  
  it('non organizer attempt to update an event', async() => {
    const polarPlunge = await createEvent(event);
    return await request(app)
      .put(`/api/v1/event/update/${polarPlunge._id}`)
      .send({ state: 'or', city: 'portland', address: '4510 ne going' })
      .set({ Authorization: 'notarealtoken' })
      .then(({ body }) => {
        expect(body).toEqual({ 'status': 500 });
      });
  });
});
