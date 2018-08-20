const { verifyGoogleAuth } = require('../utils/verifyGoogleAuth');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    const r = await verifyGoogleAuth(token);
    if (!r) {
      return res.status(401).send();
    }
    req.userId = r;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send();
  }
};
