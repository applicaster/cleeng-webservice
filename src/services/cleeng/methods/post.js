const axios = require('axios');
const config = require('../config');
const { logRequest } = require('../../../utils/logRequest');

const post = async (path, params, publisher) => {
  const url = process.env.CLEENG_BASE_URL || `${config.baseUrl}`;
  const method = 'post';
  const id = 1;
  const data = { method: path, params, id, 'json-rpc': '2.0' };
  const body = JSON.stringify(data);
  try {
    const response = await axios({ method, url, data });
    const result = response.data;
    await logRequest(publisher, { url, method, body, result });
    if (response.data.error) {
      //do somethoing with response.data.error.code and response.data.error.message
      const { code, message } = response.data.error;
      const err = new Error(message);
      err.code = code;
      throw err;
    }
    return response.data.result;
  } catch (err) {
    if (!err.code) {
      await logRequest(publisher, { url, method, body, err });
    }
    throw err;
  }
};

module.exports = { post };
