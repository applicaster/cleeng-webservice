const Reqlog = require('../models/reqlog');

const logger = require('logzio-nodejs').createLogger({
  token: process.env.LOGZIO_TOKEN,
  protocol: 'https'
});

const logRequest = async (publisher, data) => {
  try {
    const publisherId = publisher._id;
    data.publisherId = publisherId;
    try {
      const body = data.body ? JSON.parse(data.body) : null;
      if (body && body.params) {
        data.customerEmail = body.params.customerEmail;
        data.customerToken = body.params.customerToken;
        if (body.params.password) delete body.params.password;
      }
      data.message = JSON.stringify(body);
      delete data.body;
    } catch (err) {}
    logger.log(data);
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
