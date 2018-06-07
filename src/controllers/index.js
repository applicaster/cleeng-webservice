const cleengApi = require('../services/cleeng');
const { createJWT } = require('../utils/createJWT');

const login = async (req, res) => {
  try {
    const { email: customerEmail, password, facebookId } = req.body;
    const publisherToken = process.env.PUBLISHER_TOKEN;
    const data = { publisherToken, customerEmail, password, facebookId };
    const result = await cleengApi.generateToken(data);
    const { token: cleengToken } = result;
    const token = createJWT(cleengToken);
    res.status(200).send({ token });
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
    const token = createJWT(cleengToken);
    res.status(200).send({ token });
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const subscriptions = async (req, res) => {
  try {
    const { offers, customerToken } = req.body;
    const results = await Promise.all(
      offers.map(offerId => {
        return cleengApi.getSubscriptionOffer({ offerId });
      })
    );

    if (customerToken) {
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

const syncSubscriptions = async (req, res) => {};

module.exports = { login, register, subscriptions, syncSubscriptions };
