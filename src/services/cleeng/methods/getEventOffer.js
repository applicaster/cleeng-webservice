const { post } = require('./post');

const getEventOffer = async (data, publisher) => {
  return post('getEventOffer', data, publisher);
};

module.exports = { getEventOffer };
