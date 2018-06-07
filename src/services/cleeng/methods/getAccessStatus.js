const { post } = require('./post');

const getAccessStatus = async data => {
  return post('getAccessStatus', data);
};

module.exports = { getAccessStatus };
