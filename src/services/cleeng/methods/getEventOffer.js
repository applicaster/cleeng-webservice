const { post } = require('./post');

const getEventOffer = async data => {
  return post('getEventOffer', data);
};

module.exports = { getEventOffer };
