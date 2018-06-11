const express = require('express');
const {
  login,
  register,
  subscriptions,
  addSubscription,
  extendToken
} = require('../controllers');

module.exports = () => {
  const router = express.Router();

  router.post('/login', login);
  router.post('/register', register);
  router.post('/subscriptions', subscriptions);
  router.post('/subscription', addSubscription);
  router.post('/extendToken', extendToken);

  return router;
};
