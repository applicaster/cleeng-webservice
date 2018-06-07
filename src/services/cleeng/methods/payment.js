const { post } = require('./post');

const payment = async data => {
  return post('payment', data);
};

module.exports = { payment };
