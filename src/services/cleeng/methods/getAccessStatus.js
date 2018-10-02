const { post } = require('./post');

const getAccessStatus = async (data, publisher) => {
  return post('getAccessStatus', data, publisher);
};

module.exports = { getAccessStatus };
