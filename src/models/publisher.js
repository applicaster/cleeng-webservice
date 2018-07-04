const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publisherSchema = new Schema({
  name: String,
  publisherToken: String,
  authToken: String,
  secretKey: String,
  offers: Object
});

const Publisher = mongoose.model('Publisher', publisherSchema);

module.exports = Publisher;
