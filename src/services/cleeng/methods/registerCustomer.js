const { post } = require('./post');
const registerCustomer = async (data, publisher) => {
  return post('registerCustomer', data, publisher);
};

module.exports = { registerCustomer };
