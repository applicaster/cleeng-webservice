const { post } = require('./post');

const generateToken = async data => {
  if (data.facebookId) {
    return post('generateCustomerTokenFromFacebook', data);
  } else {
    return post('generateCustomerTokenFromPassword', data);
  }
};

module.exports = { generateToken };
