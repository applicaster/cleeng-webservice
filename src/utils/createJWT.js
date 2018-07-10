const moment = require('moment');
const jsonwebtoken = require('jsonwebtoken');
const api = require('../services/cleeng');

const createJWT = (token, publisher, secretKey) => {
  const iss = publisher.name;
  const exp = moment()
    .add(process.env.TOKEN_EXPIRE_MINUTES, 'minutes')
    .unix();
  const payload = {
    iss,
    exp,
    token
  };
  return jsonwebtoken.sign(payload, secretKey || publisher.secretKey);
};

const getTokenFromJWT = jwt => {
  const { token } = jsonwebtoken.decode(jwt);
  return token;
};

const createOffersJWT = async (cleengToken, publisher) => {
  const result = [];
  const token = createJWT(cleengToken, publisher);
  const offerId = '';
  result.push({ offerId, token });

  const { offers: allOffers } = publisher;

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
      const token = createJWT(cleengToken, publisher, secretKey);
      result.push({ offerId, token });
    }
  });

  return result;
};

module.exports = { createJWT, getTokenFromJWT, createOffersJWT };
