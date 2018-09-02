const axios = require('axios');

const payment = async (params, publisher) => {
  const {
    env = 'production',
    customerToken,
    receipt,
    offerId,
    appType,
    order,
    ipAddress
  } = params;
  const platform =
    appType &&
    (appType.toLowerCase() === 'ios' || appType.toLowerCase() === 'tvos')
      ? 'apple'
      : appType && appType.toLowerCase() === 'roku'
        ? 'roku'
        : 'android';

  if (receipt && receipt.receiptData) {
    console.log(receipt.receiptData);
  }
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
  const data = { customerToken, offerId, receipt, appType, order };
  return axios({ headers, url, method, data });
};

module.exports = { payment };
