const Publisher = require('../models/publisher');

const getPublisher = async _id => {
  try {
    const publisher = await Publisher.findOne({ _id });
    return publisher;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getPublisher };
