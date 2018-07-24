const axios = require('axios');

const payment = async (params, publisher) => {
  const {
    platform = 'apple',
    env = 'production',
    customerToken,
    receipt,
    offerId,
    appType
  } = params;
  const publisherToken = publisher.publisherToken;
  const authToken = publisher.authToken;
  const headers = {
    'Content-Type': 'application/json',
    'X-Publisher-Token': publisherToken /*,
    Authorization: `Basic ${authToken}`*/
  };
  const subdomain = env === 'sandbox' ? 'sandbox.' : '';
  const method = 'POST';
  const url = `https://${subdomain}cleeng.com/${platform}/payment`;
  const data = { customerToken, offerId, receipt, appType };
  return axios({ headers, url, method, data });
};

module.exports = { payment };
