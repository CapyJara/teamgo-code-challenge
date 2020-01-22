const chance = require('chance').Chance();
const User = require('../models/User');
const Event = require('../models/Event');

const seedUsers = (userCount) => {
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
  ca: ['saf francisco', 'los angeles', 'fresno']
};

const seedEvents = async(eventCount, organizerCount) => {
  const organizers = await seedUsers(organizerCount);
  const events = [...Array(eventCount)].map(() => {
    const state = chance.pickone(states);
    const city = chance.pickone(cities[state]);
    return {
      name: chance.animal(),
      description: chance.paragraph(),
      organizer: chance.pickone(organizers),
      eventDate: chance.date({ year: 2020 }),
      state: state,
      city: city,
      address: chance.address()
    };
  });
  return await Event.create(events);
};

const seedAttendees = async(eventCount, organizerCount, attendeeCount) => {
  const events = await seedEvents(eventCount, organizerCount);
  const users = await seedUsers(attendeeCount);
  await Promise.all([...Array(attendeeCount)].map(async(_, j) => {
    return await Event.findByIdAndUpdate(chance.pickone(events)._id,
      { $addToSet: { attendees: users[j]._id }, }
    );
  }));
};

const seed = async(eventCount, organizerCount, attendeeCount) => await seedAttendees(eventCount, organizerCount, attendeeCount);

module.exports = seed;
