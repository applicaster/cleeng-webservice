const { post } = require('./post');

const applyCoupon = async (data, publisher) => {
  return post('applyCoupon', data, publisher);
};

module.exports = { applyCoupon };
