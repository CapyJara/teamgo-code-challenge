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
  state: {
    type: String,
    uppercase: true,
    trim: true,
    maxlength: 2,
    minlength: 2,
    required: true
  },
  city: {
    type: String,
    uppercase: true,
    trim: true,
    required: true
  },
  address: {
    type: String,
    uppercase: true,
    required: true
  }
});

module.exports = mongoose.model('Event', schema);
