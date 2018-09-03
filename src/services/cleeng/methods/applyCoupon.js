const { post } = require('./post');

const applyCoupon = async data => {
  return post('applyCoupon', data);
};

module.exports = { applyCoupon };
