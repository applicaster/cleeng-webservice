const moment = require('moment');
const jsonwebtoken = require('jsonwebtoken');

const createJWT = token => {
  const iss = process.env.CUSTOMER_NAME;
  const exp = moment()
    .add(process.env.TOKEN_EXPIRE_MINUTES, 'minutes')
    .unix();
  const payload = {
    iss,
    exp,
    token
  };
  return jsonwebtoken.sign(payload, process.env.SECRET_KEY);
};

module.exports = { createJWT };
