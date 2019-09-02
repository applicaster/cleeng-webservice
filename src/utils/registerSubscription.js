const cleengApi = require('../services/cleeng');

const registerSubscription = async ({publisher, body}) => {
  try {
    const {
      cleengToken,
      couponCode = '',
      offerId,
      publisherToken
    } = body;

    if (couponCode) {
      const { email: customerEmail } =
      (await cleengApi.getCustomer(cleengToken, publisher)) || {};

      const { success } = await cleengApi.applyCoupon({
          publisherToken,
          offerId,
          customerEmail,
          couponCode
        },
        publisher
      );
      return success;
    }

    const { data } = await cleengApi.payment(body, publisher);
    return { ...data, offerId };

  } catch (err) {
    console.log(err);
    return err.message;
  }
};

module.exports = { registerSubscription };