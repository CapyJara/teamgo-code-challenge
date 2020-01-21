const Event = require('../event');
const mongoose = require('mongoose');

describe('Event Model', () => {

  it('Valid event model', () => {
    const data = {
      name: 'Cool Event',
      description: 'ya know, cool stuff is happening',
      organizer: new mongoose.Types.ObjectId,
      eventDate: Date.now()
    };

    const user = new Event(data);
    expect(user.name).toEqual(data.name);
    expect(user.description).toEqual(data.description);
    expect(user.organizer).toEqual(expect.any(mongoose.Types.ObjectId));
    expect(user.attendees).toEqual(expect.any(Array));
    expect(user.eventDate).toEqual(expect.any(Date));
    expect(user.createdAt).toEqual(expect.any(Date));
  });
});
