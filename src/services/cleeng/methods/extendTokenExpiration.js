const { post } = require('./post');

const extendTokenExpiration = async (data, publisher) => {
  return post('extendTokenExpiration', data, publisher);
};

module.exports = { extendTokenExpiration };
