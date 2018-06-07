const moment = require('moment');
const jsonwebtoken = require('jsonwebtoken');
const allOffers = require('../data/offers');
const api = require('../services/cleeng');

const createJWT = (token, secretKey) => {
  const iss = process.env.CUSTOMER_NAME;
  const exp = moment()
    .add(process.env.TOKEN_EXPIRE_MINUTES, 'minutes')
    .unix();
  const payload = {
    iss,
    exp,
    token
  };
  return jsonwebtoken.sign(payload, secretKey || process.env.SECRET_KEY);
};

const getTokenFromJWT = jwt => {
  const { token } = jsonwebtoken.decode(jwt);
  return token;
};

const createOffersJWT = async cleengToken => {
  const result = [];
  const token = createJWT(cleengToken);
  const offerId = '';
  result.push({ offerId, token });

  const offersStatuses = await Promise.all(
    allOffers.map(offer => {
      const { offerId } = offer;
      const customerToken = cleengToken;
      return api.getAccessStatus({ offerId, customerToken });
    })
  );

  const activeOffers = offersStatuses.filter(offer => {
    const { accessGranted } = offer;
    return accessGranted === true;
  });

  activeOffers.forEach((obj, index) => {
    const { offerId } = allOffers[index];
    const { secretKey } =
      allOffers.find(aOffer => {
        return aOffer.offerId === offerId;
      }) || {};

    if (secretKey) {
      const token = createJWT(cleengToken, secretKey);
      result.push({ offerId, token });
    }
  });

  return result;
};

module.exports = { createJWT, getTokenFromJWT, createOffersJWT };
