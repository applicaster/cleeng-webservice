const axios = require('axios');

const payment = async params => {
  const {
    platform = 'apple',
    env = 'production',
    customerToken,
    receipt: _receipt,
    offerId,
    appType
  } = params;
  const publisherToken = process.env.PUBLISHER_TOKEN;
  const authToken = process.env.AUTH_TOKEN;
  const headers = {
    'Content-Type': 'application/json',
    'X-Publisher-Token': publisherToken,
    Authorization: `Basic ${authToken}`
  };
  const subdomain = env === 'sandbox' ? 'sandbox.' : '';
  const method = 'POST';
  const url = `https://${subdomain}cleeng.com/${platform}/payment`;
  const receipt = JSON.parse(_receipt);
  receipt.receiptData = decodeURIComponent(receipt.receiptData);
  const data = { customerToken, offerId, receipt, appType };
  return axios({ headers, url, method, data });
};

module.exports = { payment };
