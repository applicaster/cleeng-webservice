const Reqlog = require('../models/reqlog');

const logRequest = async (publisher, data) => {
  try {
    const publisherId = publisher._id;
    const publisherLogs = await Reqlog.find({ publisherId });
    if (
      publisherLogs.length >= parseInt(process.env.PUBLISHER_MAX_LOGS || 1000)
    ) {
      console.log(`Publisher ${publisherId} reached maximum logs count`);
      return;
    }
    data.publisherId = publisherId;
    data.reqtime = new Date();
    const reqlog = new Reqlog();
    reqlog.set(data);
    const result = await reqlog.save();
    return result._id.toString();
  } catch (err) {
    console.log(`Error logging request: ${err.message}`);
  }
};

const logRequestResponse = async (_id, response) => {
  try {
    const reqlog = Reqlog.findOne({ _id });
    reqlog.response = response;
    await reqlog.save();
  } catch (err) {
    console.log(`Error logging response: ${err.message}`);
  }
};

const clearLogs = async publisher => {
  try {
    const publisherId = publisher._id;
    await Reqlog.deleteMany({ publisherId });
  } catch (err) {
    console.log(`Error clearing logs: ${err.message}`);
  }
};

module.exports = { logRequest, logRequestResponse, clearLogs };
