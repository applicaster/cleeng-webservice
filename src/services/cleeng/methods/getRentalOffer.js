const { post } = require('./post');

const getRentalOffer = async (data, publisher) => {
  return post('getRentalOffer', data, publisher);
};

module.exports = { getRentalOffer };
