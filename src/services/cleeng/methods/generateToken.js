const { post } = require('./post');

const generateToken = async (data, publisher) => {
  if (data.facebookId) {
    return post('generateCustomerTokenFromFacebook', data, publisher);
  } else {
    return post('generateCustomerTokenFromPassword', data, publisher);
  }
};

module.exports = { generateToken };
