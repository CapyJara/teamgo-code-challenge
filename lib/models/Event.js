const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  organizer: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  attendees: [mongoose.Schema.Types.ObjectId],
  eventDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
});

module.exports = mongoose.model('Event', schema);
