const { generateToken } = require('./methods/generateToken');
const { getAccessStatus } = require('./methods/getAccessStatus');
const { getSubscriptionOffer } = require('./methods/getSubscriptionOffer');
const { registerCustomer } = require('./methods/registerCustomer');
const { payment } = require('./methods/payment');

module.exports = {
  generateToken,
  getAccessStatus,
  getSubscriptionOffer,
  registerCustomer,
  payment
};
