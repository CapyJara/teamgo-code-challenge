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

schema.statics.dateRange = function(start, end) {
  const startD = new Date(start);
  const endD = new Date(end);
  return this.aggregate([
    {
      '$match': {
        'eventDate': {
          '$gte': startD, 
          '$lt': endD
        }
      }
    }
  ]);
};
module.exports = mongoose.model('Event', schema);
