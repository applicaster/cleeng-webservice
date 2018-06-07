const express = require('express');
const {
  login,
  register,
  subscriptions,
  addSubscription
} = require('../controllers');

module.exports = () => {
  const router = express.Router();

  router.post('/login', login);
  router.post('/register', register);
  router.post('/subscriptions', subscriptions);
  router.post('/subscription', addSubscription);

  return router;
};
