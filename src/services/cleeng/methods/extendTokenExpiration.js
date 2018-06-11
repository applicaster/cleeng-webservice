const { post } = require('./post');

const extendTokenExpiration = async data => {
  return post('extendTokenExpiration', data);
};

module.exports = { extendTokenExpiration };
