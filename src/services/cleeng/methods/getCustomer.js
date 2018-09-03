const { post } = require('./post');

const getCustomer = async customerToken => {
  return post('getCustomer', { customerToken });
};

module.exports = { getCustomer };
