const cleengApi = require('../services/cleeng');
const {
  createJWT,
  createOffersJWT,
  getTokenFromJWT
} = require('../utils/createJWT');
const { registerSubscription } = require('../utils/registerSubscription');
const { setOfferIdFromAuthId } = require('../utils/setOfferIdFromAuthId');

const login = async (req, res) => {
  try {
    const { email: customerEmail, password, facebookId } = req.body;
    const publisherToken = req.publisher.publisherToken;
    const data = { publisherToken, customerEmail, password, facebookId };
    const result = await cleengApi.generateToken(data, req.publisher);
    const { token: cleengToken } = result;
    const tokens = await createOffersJWT(
      cleengToken,
      req.publisher,
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    );
    res.status(200).send(tokens);
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const register = async (req, res) => {
  try {
    const {
      email,
      password,
      facebookId,
      locale: _locale = '',
      country,
      currency
    } = req.body;
    const publisherToken = req.publisher.publisherToken;
    const supportedLocales = (process.env.SUPPORTED_LOCALES || '').split(',');
    const locale =
      supportedLocales.indexOf(_locale) === -1
        ? process.env.DEFAULT_LOCALE || 'en_US'
        : _locale;
    if (supportedLocales.indexOf(_locale) === -1) {
      console.log(
        `Locale: ${_locale} not supported. using default locale: ${locale}`
      );
    }
    const customerData = {
      email,
      password,
      facebookId,
      locale,
      country,
      currency
    };
    const data = { publisherToken, customerData };
    const result = await cleengApi.registerCustomer(data, req.publisher);
    const { token: cleengToken } = result;
    const tokens = await createOffersJWT(
      cleengToken,
      req.publisher,
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    );
    res.status(200).send(tokens);
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const subscriptions = async (req, res) => {
  try {
    const { offers: publisherOffers } = req.publisher;
    const allOffers = publisherOffers.filter(offer => offer.hideOffer !== true);
    const { offers: _offers = '', token, byAuthId = 0, videoId } = req.body;
    let offers = Array.isArray(_offers)
      ? _offers
      : _offers
      ? _offers.split(',')
      : allOffers.map(offer => offer.offerId);

    if (byAuthId == 1) {
      offers = offers.map(authId => {
        const { offerId } =
          allOffers.find(offer => authId == offer.authId) || {};
        if (!offerId) {
          const error = new Error(`Invalid authId: ${authId}`);
          error.code = 1001;
          throw error;
        }
        return offerId;
      });
    }

    const results = await Promise.all(
      offers.map(offerId => {
        if (offerId.toLowerCase().startsWith('p')) {
          return cleengApi.getPassOffer({ offerId }, req.publisher);
        } else if (offerId.toLowerCase().startsWith('e')) {
          return cleengApi.getEventOffer({ offerId }, req.publisher);
        } else if (offerId.toLowerCase().startsWith('a')) {
          const { publisherToken } = req.publisher;
          return cleengApi.getVodOffer(
            {
              offerIdString: offerId,
              publisherToken
            },
            req.publisher
          );
        } else if (offerId.toLowerCase().startsWith('r')) {
          return cleengApi.getRentalOffer({ offerId, videoId }, req.publisher);
        } else {
          return cleengApi.getSubscriptionOffer({ offerId }, req.publisher);
        }
      })
    );

    results.forEach(result => {
      const {
        appleProductId,
        androidProductId,
        authId,
        rokuProductId,
        freeAccessLoggedInAuthID,
        should_hide_free_ribbon = false,
        is_voucher_promoted = false
      } =
        allOffers.find(offer => {
          const { offerId } = offer;
          return offerId === result.id;
        }) || {};
      result.appleProductId = appleProductId;
      result.androidProductId = androidProductId;
      result.rokuProductId = rokuProductId;
      result.authId = authId;
      result.freeAccessLoggedInAuthID = freeAccessLoggedInAuthID;
      result.is_voucher_promoted = is_voucher_promoted;
      result.should_hide_free_ribbon = should_hide_free_ribbon;
    });

    if (token) {
      const ipAddress =
        req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const customerToken = getTokenFromJWT(token);
      const accessResults = await Promise.all(
        offers.map(offerId => {
          return cleengApi.getAccessStatus(
            {
              customerToken,
              offerId,
              ipAddress
            },
            req.publisher
          );
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
    const { token, couponCode = '' } = req.body;
    const cleengToken = getTokenFromJWT(token);
    req.body.customerToken = cleengToken;
    setOfferIdFromAuthId(req.body, req.publisher);
    req.body.ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let response;
    let result;
    if (couponCode) {
      const { email: customerEmail } =
        (await cleengApi.getCustomer(cleengToken, req.publisher)) || {};
      const { publisherToken } = req.publisher;
      const { offerId } = req.body;
      const { success } = await cleengApi.applyCoupon(
        {
          publisherToken,
          offerId,
          customerEmail,
          couponCode
        },
        req.publisher
      );
      result = success;
    } else {
      response = await cleengApi.payment(req.body, req.publisher);
      result = response.data;
    }

    res.status(200).send({ result });
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const restoreSubscriptions = async (
  { publisher, body, headers, connection },
  res
) => {
  try {
    const { offers, publisherToken } = publisher;
    const { token, receiptData, appType, receipts } = body;
    const cleengToken = getTokenFromJWT(token);

    const ipAddress = headers['x-forwarded-for'] || connection.remoteAddress;

    const result = await Promise.all(
      receipts.map(receipt => {
        const { productId } = receipt;
        const { offerId } = offers.find(
          ({ androidProductId, appleProductId }) =>
            productId === androidProductId || productId === appleProductId
        );

        receipt = { ...receipt, receiptData };

        return registerSubscription({
          publisher,
          body: {
            customerToken: cleengToken,
            appType,
            receipt,
            offerId,
            publisherToken,
            ipAddress
          }
        });
      })
    );

    res.status(200).send(result);
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
    const publisherToken = req.publisher.publisherToken;
    const extensionTime = process.env.TOKEN_EXPIRE_MINUTES * 60;
    const data = { customerToken, publisherToken, extensionTime };
    await cleengApi.extendTokenExpiration(data, req.publisher);
    const tokens = await createOffersJWT(
      customerToken,
      req.publisher,
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    );
    res.status(200).send(tokens);
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const passwordReset = async (req, res) => {
  try {
    const { email: customerEmail } = req.body;

    const publisherToken = req.publisher.publisherToken;
    const data = { customerEmail, publisherToken };
    const result = await cleengApi.requestPasswordReset(data, req.publisher);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const submitConsent = async (req, res) => {
  try {
    const { token, consentType: name, state = 'accepted', version } = req.body;

    const cleengToken = getTokenFromJWT(token);
    const { email: customerEmail } =
      (await cleengApi.getCustomer(cleengToken, req.publisher)) || {};

    const publisherToken = req.publisher.publisherToken;
    const data = { customerEmail, publisherToken, name, state, version };
    const result = await cleengApi.submitConsent(data, req.publisher);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const updateCustomerEmail = async (req, res) => {
  try {
    const { token, newEmail } = req.body;

    const cleengToken = getTokenFromJWT(token);
    const { email: customerEmail } =
      (await cleengApi.getCustomer(cleengToken, req.publisher)) || {};

    const publisherToken = req.publisher.publisherToken;
    const data = { customerEmail, newEmail, publisherToken };
    const result = await cleengApi.updateCustomerEmail(data, req.publisher);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const getCustomer = async (req, res) => {
  try {
    const { token } = req.body;

    const cleengToken = getTokenFromJWT(token);
    const result =
      (await cleengApi.getCustomer(cleengToken, req.publisher)) || {};
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const generateCustomerToken = async (req, res) => {
  try {
    const { email } = req.body;
    const result =
      (await cleengApi.generateCustomerToken(email, req.publisher)) || {};
    const { token: cleengToken } = result;
    const tokens = await createOffersJWT(
      cleengToken,
      req.publisher,
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    );
    res.status(200).send(tokens);
  } catch (err) {
    console.log(err);
    const { code, message } = err;
    res.status(500).send({ code, message });
  }
};

const getFreeAccessToken = async (req, res) => {
  try {
    const { authId, userToken } = req.body;
    const freeOffer = req.publisher.offers.find(offer => {
      return offer.freeAccessLoggedInAuthID === authId;
    });
    if (freeOffer) {
      const token = createJWT(userToken, req.publisher);
      return res.status(200).send(token);
    }
    res.status(404).send();
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
  restoreSubscriptions,
  extendToken,
  passwordReset,
  submitConsent,
  updateCustomerEmail,
  getCustomer,
  generateCustomerToken,
  getFreeAccessToken
};
