const { post } = require('./post');

const getCustomer = async (customerToken, publisher) => {
  return post('getCustomer', { customerToken }, publisher);
};

module.exports = { getCustomer };
