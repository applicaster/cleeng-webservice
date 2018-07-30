const { post } = require('./post');

const getRentalOffer = async data => {
  return post('getRentalOffer', data);
};

module.exports = { getRentalOffer };
