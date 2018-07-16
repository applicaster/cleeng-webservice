const setOfferIdFromAuthId = async (params, publisher) => {
  const { offerId, authId } = params;
  if (offerId || !authId || !publisher) {
    return;
  }

  const { offers } = publisher;
  const offer = offers.find(offer => {
    const { authId: aAuthId } = offer;
    return aAuthId == authId;
  });
  if (offer) {
    params.offerId = offer.offerId;
  }
};

module.exports = { setOfferIdFromAuthId };
