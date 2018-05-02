const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  title: String,
  name: String,
  comment: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topic', TopicSchema);