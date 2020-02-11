const axios = require('axios');
const {
  verifyAppStoreReceipt
} = require('../../../utils/verifyAppStoreReceipt');

const { logRequest } = require('../../../utils/logRequest');

const payment = async (params, publisher) => {
  const {
    env = 'production',
    customerToken,
    receipt,
    offerId,
    appType,
    order,
    ipAddress,
    isRestored = false
  } = params;
  const platform =
    appType &&
    (appType.toLowerCase() === 'ios' || appType.toLowerCase() === 'tvos')
      ? 'apple'
      : appType && appType.toLowerCase() === 'roku'
      ? 'roku'
      : appType && appType.toLowerCase() === 'amazon'
      ? 'amazon'
      : 'android';

  if (platform === 'apple' && isRestored) {
    const { offers } = publisher;
    const offer = offers.find(offer => offer.offerId === offerId);
    if (offer && offer.isAutoRenewable === true) {
      receipt.transactionId = await verifyAppStoreReceipt(
        receipt.receiptData,
        publisher.appStoreSharedKey
      );
    }
  }

  const publisherToken = publisher.publisherToken;
  const headers = {
    'Content-Type': 'application/json',
    'X-Publisher-Token': publisherToken
  };
  const subdomain = env === 'sandbox' ? 'sandbox.' : '';
  const method = 'POST';
  const url = `https://${subdomain}${process.env.CLEENG_PAYMENT_BASE_URL ||
    'cleeng.com'}/${platform}/payment`;
  const data = { customerToken, offerId, receipt, appType, order };

  try {
    const response = await axios({ headers, url, method, data });
    const result = response.data;
    await logRequest(publisher, {
      url,
      method,
      body: data,
      headers,
      result
    });
    return response;
  } catch (err) {
    await logRequest(publisher, { url, method, body: data, headers, err });
    throw err;
  }
};

module.exports = { payment };
