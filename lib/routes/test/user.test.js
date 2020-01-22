require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const connect = require('../../utils/connect');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());
beforeEach(() => mongoose.connection.dropDatabase());
afterAll(() => mongoose.connection.close());

const signUpUser = (userInfo) => {
  return request(app)
    .post('/api/v1/user/signup')
    .send(userInfo);
};

describe('user route tests', () => {
  it('signs up a new user', async() => {
    return signUpUser({ email: 'jared@jared.com', password: 'secret' })
      .then(res => {
        expect(res.body).toEqual({
          email: 'jared@jared.com',
          _id: expect.any(String),
          token: expect.any(String),
        });
      });
  });
  it('signs up a new user with existing email', async() => {
    const userInfo = { email: 'terran@jared.com', password: 'secret' };
    await signUpUser(userInfo);
    return signUpUser(userInfo)
      .then(res => {
        expect(res.body.status).toEqual(500);
        expect(res.error.text).toEqual('{"status":500}');
      });
  });

  it('signs in a user', () => {
    const userInfo = { email: 'jessy@jared.com', password: 'secret' };
    return signUpUser(userInfo)
      .then(() => {
        return request(app)
          .post('/api/v1/user/signin')
          .send(userInfo)
          .then(res => {
            expect(res.body).toEqual({
              email: 'jessy@jared.com',
              _id: expect.any(String),
              token: expect.any(String),
            });
          });
      }); 
  });

  it('signs in a user with bad password', () => {
    const userInfo = { email: 'jessy@jared.com', password: 'secret' };
    return signUpUser(userInfo)
      .then(() => {
        return request(app)
          .post('/api/v1/user/signin')
          .send({ email: 'jessy@jared.com', password: 'badSecret' })
          .then(res => {
            expect(res.body.status).toEqual(500);
            expect(res.error.text).toEqual('{"status":500}');
          });
      }); 
  });

});
