const axios = require('axios');

const SANDBOX_URL = 'https://sandbox.itunes.apple.com/verifyReceipt';
const PRODUCTION_URL = 'https://buy.itunes.apple.com/verifyReceipt';

const verifyAppStoreReceipt = async (receiptData, sharedKey) => {
  try {
    const method = 'POST';
    let url = PRODUCTION_URL;
    const data = { 'receipt-data': receiptData, password: sharedKey };
    const headers = { 'Content-Type': 'application/json' };
    let response = await axios(url, method, data, headers);
    const { status } = response.data;
    if (status === 21007) {
      url = SANDBOX_URL;
      response = await axios(url, method, data);
    }

    const { latest_receipt_info, status: st } = response.data;

    if (st !== 0) {
      const e = new Error('Error verifying receipt');
      e.code = st;
      throw e;
    }

    return latest_receipt_info;
  } catch (err) {
    console.log(`Error verifyAppStoreReceipt: ${err.message}`);
    throw err;
  }
};

module.exports = { verifyAppStoreReceipt };
