const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activityLogSchema = new Schema({
  publisherId: { type: String, index: true },
  logtime: Date,
  activityType: { type: Number },
  diffData: Object,
  user: String
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
