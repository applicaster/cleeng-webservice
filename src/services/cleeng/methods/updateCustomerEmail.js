const { post } = require('./post');
const updateCustomerEmail = async (data, publisher) => {
  return post('updateCustomerEmail', data, publisher);
};

module.exports = { updateCustomerEmail };
