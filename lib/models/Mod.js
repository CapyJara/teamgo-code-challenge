const mongoose = require('mongoose');

const modSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true
  }
}, {
  versionKey: false
});

const Mod = mongoose.model('Mod', modSchema);

module.exports = Mod;
