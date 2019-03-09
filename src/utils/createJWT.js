const moment = require('moment');
const jsonwebtoken = require('jsonwebtoken');
const api = require('../services/cleeng');

const createJWT = (token, publisher, secretKey, expiresAt) => {
  const iss = publisher.name;
  //const exp = expiresAt ? expiresAt : moment()
  const exp = moment().add(process.env.TOKEN_EXPIRE_MINUTES, 'minutes').unix();
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

const createOffersJWT = async (cleengToken, publisher, ipAddress) => {
  const result = [];
  const token = createJWT(cleengToken, publisher);
  const offerId = '';
  result.push({ offerId, token });

  const { offers: allOffers } = publisher;

  const offersStatuses = await Promise.all(
    allOffers.map(offer => {
      const { offerId } = offer;
      const customerToken = cleengToken;
      return api.getAccessStatus({ offerId, customerToken, ipAddress });
    })
  );

  const activeOffers = offersStatuses
    .map((status, i) => {
      const { offerId } = allOffers[i];
      status.offerId = offerId;
      return status;
    })
    .filter(status => {
      const { accessGranted } = status;
      return accessGranted === true;
    });

  activeOffers.forEach(obj => {
    const { offerId, expiresAt: _expiresAt } = obj;
    let expiresAt;
    try {
      expiresAt = parseInt(_expiresAt);
    } catch (err) {

    }
    const { secretKey, authId } =
      allOffers.find(aOffer => {
        return aOffer.offerId === offerId;
      }) || {};

    if (secretKey) {
      const token = createJWT(cleengToken, publisher, secretKey, expiresAt);
      result.push({ offerId, token, authId });
    }
  });

  return result;
};

module.exports = { createJWT, getTokenFromJWT, createOffersJWT };
