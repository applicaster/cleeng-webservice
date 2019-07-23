const { post } = require('./post');

const generateCustomerToken = async (customerEmail, publisher) => {
  const publisherToken = publisher.publisherToken;
  return post('generateCustomerToken', { customerEmail, publisherToken }, publisher);
};

module.exports = { generateCustomerToken };
