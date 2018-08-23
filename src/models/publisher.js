const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publisherSchema = new Schema({
  name: String,
  publisherToken: String,
  authToken: String,
  secretKey: { type: String, default: '1234' },
  offers: Object,
  updatedAt: Date,
  updatedBy: String
});

const Publisher = mongoose.model('Publisher', publisherSchema);

module.exports = Publisher;
