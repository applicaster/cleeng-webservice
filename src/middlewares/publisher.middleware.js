const { getPublisher } = require('../utils/getPublisher');

module.exports = async (req, res, next) => {
  try {
    const { publisherId } = req.body;
    req.publisher = await getPublisher(publisherId);
  } catch (err) {
    console.log(err);
  }

  next();
};
