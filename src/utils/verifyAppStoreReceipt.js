const axios = require('axios');
const qs = require('query-string');
//require('axios-debug')(axios);

const SANDBOX_URL = 'https://sandbox.itunes.apple.com/verifyReceipt';
const PRODUCTION_URL = 'https://buy.itunes.apple.com/verifyReceipt';

const verifyAppStoreReceipt = async (receiptData, sharedKey) => {
  try {
    const method = 'POST';
    let url = PRODUCTION_URL;
    const data = {
      'receipt-data': receiptData,
      password: sharedKey
    };
    let response = await axios({ url, method, data });
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

    const receipts = latest_receipt_info
      .filter(info => info.expires_date_ms > new Date().getTime())
      .sort((a, b) => a.expires_date_ms - b.expires_date_ms);
    if (receipts.length === 0) {
      const e = new Error('All receipts are expired');
      e.code = st;
      throw e;
    }

    const { transaction_id } = receipts[0];
    return transaction_id;
  } catch (err) {
    console.log(`Error verifyAppStoreReceipt: ${err.message}`);
    throw err;
  }
};

module.exports = { verifyAppStoreReceipt };
