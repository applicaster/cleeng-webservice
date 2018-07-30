const { post } = require('./post');

const getVodOffer = async data => {
  return post('getVodOffer', data);
};

module.exports = { getVodOffer };
