const mongoose = require('mongoose');
const chance = require('chance').Chance();

const User = mongoose.model('User');
const Event = mongoose.model('Event');

const seedUsers = (userCount = 5) => {
  const users = [...Array(userCount)].map(() => ({
    email: chance.email(),
    password: chance.profession()
  }));
  return User.create(users);
};

const states = ['or', 'wa', 'ca'];
const cities = {
  or: ['portland', 'beaverton', 'Eugene'],
  wa: ['seattle', 'vancouver', 'spokane'],
  ca: ['saf fransisco', 'los angeles', 'fresno']
};

const seedEvents = async(eventCount = 50) => {
  const users = await seedUsers();
  const events = [...Array(eventCount)].map(() => {
    const state = chance.pickone(states);
    const city = chance.pickone(cities[state]);
    return {
      name: chance.animal(),
      description: chance.paragraph(),
      organizer:chance.pickone(users),
      eventDate:chance.date(),
      state: state,
      city: city,
      address: chance.address()
    };
  });
  return Event.create(events);
};

const seed = async() => await seedEvents();

module.exports = seed;
