const { post } = require('./post');
const submitConsent = async (data, publisher) => {
  return post('submitConsent', data, publisher);
};

module.exports = { submitConsent };
