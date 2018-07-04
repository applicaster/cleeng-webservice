const { getPublisher } = require('../utils/getPublisher');

module.exports = async (req, res, next) => {
  try {
    const { publisherId } = req.body;
    req.publisher = await getPublisher(publisherId);
    if (!req.publisher) {
      return res.status(401).send('bad publisher');
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send('bad publisher');
  }

  next();
};
