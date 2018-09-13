const { post } = require('./post');

const getVodOffer = async data => {
  return post('getVodOffer', data).then(response => {
    const { vod } = response;
    return vod;
  });
};

module.exports = { getVodOffer };
