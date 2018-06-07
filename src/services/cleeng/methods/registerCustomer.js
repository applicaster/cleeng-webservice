const { post } = require('./post');
const registerCustomer = async data => {
  return post('registerCustomer', data);
};

module.exports = { registerCustomer };
