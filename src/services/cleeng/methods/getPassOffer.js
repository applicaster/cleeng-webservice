const { post } = require('./post');

const getPassOffer = async data => {
  return post('getPassOffer', data);
};

module.exports = { getPassOffer };
