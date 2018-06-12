const { post } = require('./post');

const requestPasswordReset = async data => {
  return post('requestPasswordReset', data);
};

module.exports = { requestPasswordReset };
