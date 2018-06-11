const cleengApi = require('../services/cleeng');
const { createOffersJWT, getTokenFromJWT } = require('../utils/createJWT');
const allOffers = require('../data/offers');

const login = async (req, res) => {
  try {
    const { email: customerEmail, password, facebookId } = req.body;
    const publisherToken = process.env.PUBLISHER_TOKEN;
    const data = { publisherToken, customerEmail, password, facebookId };
    const result = await cleengApi.generateToken(data);
    const { token: cleengToken } = result;
    const tokens = await createOffersJWT(cleengToken);
    res.status(200).send(tokens);
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, facebookId, locale, country, currency } = req.body;
    const publisherToken = process.env.PUBLISHER_TOKEN;
    const customerData = {
      email,
      password,
      facebookId,
      locale,
      country,
      currency
    };
    const data = { publisherToken, customerData };
    const result = await cleengApi.registerCustomer(data);
    const { token: cleengToken } = result;
    const tokens = await createOffersJWT(cleengToken);
    res.status(200).send(tokens);
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const subscriptions = async (req, res) => {
  try {
    const { offers: _offers, token } = req.body;
    const offers = _offers
      ? _offers.split(',')
      : allOffers.map(offer => offer.offerId);

    const results = await Promise.all(
      offers.map(offerId => {
        if (offerId.toLowerCase().startsWith('p')) {
          return cleengApi.getPassOffer({ offerId });
        } else {
          return cleengApi.getSubscriptionOffer({ offerId });
        }
      })
    );

    results.forEach(result => {
      const { appleProductId, androidProductId } =
        allOffers.find(offer => {
          const { offerId } = offer;
          return offerId === result.id;
        }) || {};
      result.appleProductId = appleProductId;
      result.androidProductId = androidProductId;
    });

    if (token) {
      const customerToken = getTokenFromJWT(token);
      const accessResults = await Promise.all(
        offers.map(offerId => {
          return cleengApi.getAccessStatus({ customerToken, offerId });
        })
      );

      results.forEach((result, index) => {
        const { accessGranted } = accessResults[index];
        result.accessGranted = accessGranted;
      });
    }

    res.status(200).send(results);
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const addSubscription = async (req, res) => {
  try {
    const { token } = req.body;
    const cleengToken = getTokenFromJWT(token);
    req.body.customerToken = cleengToken;
    const response = await cleengApi.payment(req.body);
    res.status(200).send(response.data);
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const extendToken = async (req, res) => {
  try {
    const { token } = req.body;
    const customerToken = getTokenFromJWT(token);
    const publisherToken = process.env.PUBLISHER_TOKEN;
    const extensionTime = process.env.TOKEN_EXPIRE_MINUTES * 60;
    const data = { customerToken, publisherToken, extensionTime };
    await cleengApi.extendTokenExpiration(data);
    const tokens = await createOffersJWT(customerToken);
    res.status(200).send(tokens);
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

module.exports = {
  login,
  register,
  subscriptions,
  addSubscription,
  extendToken
};
