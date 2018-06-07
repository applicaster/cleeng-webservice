const { post } = require('./post');

const getSubscriptionOffer = async data => {
  return post('getSubscriptionOffer', data);
};

module.exports = { getSubscriptionOffer };
