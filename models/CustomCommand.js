const mongoose = require('mongoose');

const customCommandSchema = new mongoose.Schema({
  guildId: String,
  name: String,
  response: String
});

module.exports = mongoose.model('CustomCommand', customCommandSchema);