const { post } = require('./post');

const getPassOffer = async (data, publisher) => {
  return post('getPassOffer', data, publisher);
};

module.exports = { getPassOffer };
