const { post } = require('./post');

const getSubscriptionOffer = async (data, publisher) => {
  return post('getSubscriptionOffer', data, publisher);
};

module.exports = { getSubscriptionOffer };
