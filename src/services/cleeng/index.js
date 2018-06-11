const { generateToken } = require('./methods/generateToken');
const { getAccessStatus } = require('./methods/getAccessStatus');
const { getSubscriptionOffer } = require('./methods/getSubscriptionOffer');
const { registerCustomer } = require('./methods/registerCustomer');
const { payment } = require('./methods/payment');
const { getPassOffer } = require('./methods/getPassOffer');
const { extendTokenExpiration } = require('./methods/extendTokenExpiration');

module.exports = {
  generateToken,
  getAccessStatus,
  getSubscriptionOffer,
  getPassOffer,
  registerCustomer,
  payment,
  extendTokenExpiration
};
