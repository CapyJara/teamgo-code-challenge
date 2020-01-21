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

const data = {
  name: 'Cool Event',
  description: 'ya know, cool stuff is happening',
  organizer: new mongoose.Types.ObjectId,
  eventDate: Date.now()
};
const createEvent = () => {
  return request(app)
    .post('/api/v1/event')
    .set({ Authorization: user.token })
    .send(data);
};

describe('event route tests', () => {

  it('creates new event', async() => {
    return createEvent()
      .then(res => {
        const { name, description, organizer, attendees, eventDate, createdAt } = res.body;
        expect(name).toEqual('Cool Event');
        expect(description).toEqual('ya know, cool stuff is happening');
        expect(organizer).toEqual(expect.any(String));
        expect(attendees).toEqual(expect.any(Array));
        expect(eventDate).toEqual(expect.any(String));
        expect(createdAt).toEqual(expect.any(String));
      });
  });
  
});
