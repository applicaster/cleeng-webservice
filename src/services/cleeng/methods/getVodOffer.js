const { post } = require('./post');

const getVodOffer = async (data, publisher) => {
  return post('getVodOffer', data, publisher).then(response => {
    const { vod } = response;
    return vod;
  });
};

module.exports = { getVodOffer };
