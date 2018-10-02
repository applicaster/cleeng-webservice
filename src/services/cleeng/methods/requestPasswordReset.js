const { post } = require('./post');

const requestPasswordReset = async (data, publisher) => {
  return post('requestPasswordReset', data, publisher);
};

module.exports = { requestPasswordReset };
