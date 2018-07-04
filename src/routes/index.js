const basicAuth = require('express-basic-auth');

const express = require('express');
const {
  login,
  register,
  subscriptions,
  addSubscription,
  extendToken,
  passwordReset,
  updatePublisher
} = require('../controllers');

module.exports = () => {
  const router = express.Router();

  router.post('/login', login);
  router.post('/register', register);
  router.post('/subscriptions', subscriptions);
  router.post('/subscription', addSubscription);
  router.post('/extendToken', extendToken);
  router.post('/passwordReset', passwordReset);
  router.post(
    '/publisher',
    basicAuth({
      users: { admin: process.env.ADMIN_PASSWORD }
    }),
    updatePublisher
  );

  return router;
};
