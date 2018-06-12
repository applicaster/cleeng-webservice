const express = require('express');
const {
  login,
  register,
  subscriptions,
  addSubscription,
  extendToken,
  passwordReset
} = require('../controllers');

module.exports = () => {
  const router = express.Router();

  router.post('/login', login);
  router.post('/register', register);
  router.post('/subscriptions', subscriptions);
  router.post('/subscription', addSubscription);
  router.post('/extendToken', extendToken);
  router.post('/passwordReset', passwordReset);

  return router;
};
