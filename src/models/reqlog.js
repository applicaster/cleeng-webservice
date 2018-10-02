const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reqlogSchema = new Schema({
  publisherId: { type: String, index: true },
  reqtime: Date,
  method: String,
  url: String,
  headers: String,
  body: String,
  response: Object
});

const Reqlog = mongoose.model('Reqlog', reqlogSchema);

module.exports = Reqlog;
