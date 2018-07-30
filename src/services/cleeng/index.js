const { generateToken } = require('./methods/generateToken');
const { getAccessStatus } = require('./methods/getAccessStatus');
const { getSubscriptionOffer } = require('./methods/getSubscriptionOffer');
const { registerCustomer } = require('./methods/registerCustomer');
const { payment } = require('./methods/payment');
const { getPassOffer } = require('./methods/getPassOffer');
const { extendTokenExpiration } = require('./methods/extendTokenExpiration');
const { requestPasswordReset } = require('./methods/requestPasswordReset');
const { getEventOffer } = require('./methods/getEventOffer');
const { getVodOffer } = require('./methods/getVodOffer');
const { getRentalOffer } = require('./methods/getRentalOffer');

module.exports = {
  generateToken,
  getAccessStatus,
  getSubscriptionOffer,
  getPassOffer,
  registerCustomer,
  payment,
  extendTokenExpiration,
  requestPasswordReset,
  getEventOffer,
  getVodOffer,
  getRentalOffer
};
