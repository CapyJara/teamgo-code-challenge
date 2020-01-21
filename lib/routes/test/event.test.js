require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const connect = require('../../utils/connect');

let user;
beforeAll(() => connect());
beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(async() => {
  return await request(app)
    .post('/api/v1/user/signup')
    .send({ email: 'jared@jared.com', password: 'secret' })
    .then(i => user = i.body);
});
afterAll(() => mongoose.connection.close());

const event1 = {
  name: 'Cool Event 1',
  description: 'event 1 things',
  organizer: new mongoose.Types.ObjectId,
  eventDate: Date.now(),
  state: 'or',
  city: 'portland',
  address: '4510 ne going'
};
const event2 = {
  name: 'Cool Event 2',
  description: 'event 2 things',
  organizer: new mongoose.Types.ObjectId,
  eventDate: Date.now(),
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
    return createEvent(event1)
      .then(res => {
        const { name, description, organizer, attendees, eventDate, createdAt, state, city, address } = res;
        expect(name).toEqual('Cool Event 1');
        expect(description).toEqual('event 1 things');
        expect(organizer).toEqual(expect.any(String));
        expect(attendees).toEqual(expect.any(Array));
        expect(eventDate).toEqual(expect.any(String));
        expect(createdAt).toEqual(expect.any(String));
        expect(state).toEqual('OR');
        expect(city).toEqual('PORTLAND');
        expect(address).toEqual('4510 NE GOING');
      });
  });

  it('gets all events', async() => {
    await Promise.all([
      createEvent(event1),
      createEvent(event2)
    ]);
    return await request(app)
      .get('/api/v1/event')
      .then(res => {
        expect(res.body.length).toEqual(2);
        const { name, description, organizer, attendees, eventDate, createdAt, state, city, address } = res.body[0];
        expect(name).toEqual('Cool Event 1');
        expect(description).toEqual('event 1 things');
        expect(organizer).toEqual(expect.any(String));
        expect(attendees).toEqual(expect.any(Array));
        expect(eventDate).toEqual(expect.any(String));
        expect(createdAt).toEqual(expect.any(String));
        expect(state).toEqual('OR');
        expect(city).toEqual('PORTLAND');
        expect(address).toEqual('4510 NE GOING');
      });
  });

  it('gets event by id', async() => {
    const eventOne = await createEvent(event1);
    await createEvent(event2);
    return request(app)
      .get(`/api/v1/event/${eventOne._id}`)
      .then(res => {
        const { name, description, organizer, attendees, eventDate, createdAt, state, city, address } = res.body;
        expect(name).toEqual('Cool Event 1');
        expect(description).toEqual('event 1 things');
        expect(organizer).toEqual(expect.any(String));
        expect(attendees).toEqual(expect.any(Array));
        expect(eventDate).toEqual(expect.any(String));
        expect(createdAt).toEqual(expect.any(String));
        expect(state).toEqual('OR');
        expect(city).toEqual('PORTLAND');
        expect(address).toEqual('4510 NE GOING');
      });
  });
  
});
