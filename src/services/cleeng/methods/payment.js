const axios = require('axios');
const {
  verifyAppStoreReceipt
} = require('../../../utils/verifyAppStoreReceipt');

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
  return axios({ headers, url, method, data });
};

module.exports = { payment };
