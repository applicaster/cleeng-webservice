const ActivityLog = require('../models/activityLog');

const activityTypes = {
  ADD_PUBLISHER: 1,
  ADD_OFFER: 2,
  REMOVE_OFFER: 3,
  UPDATE_OFFER: 4,
  UPDATE_PUBLISHER: 5
};

const addActivityLog = async (publisher, user, activityType, diffData) => {
  try {
    const publisherId = publisher._id;
    const logtime = new Date();
    const activityLog = new ActivityLog();
    activityLog.set({ publisherId, logtime, user, activityType, diffData });
    const result = await activityLog.save();
    return result._id.toString();
  } catch (err) {
    console.log(`Error creating activity log: ${err.message}`);
  }
};

module.exports = { addActivityLog, activityTypes };
