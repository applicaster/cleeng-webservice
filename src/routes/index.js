const basicAuth = require('express-basic-auth');

const express = require('express');
const {
  login,
  register,
  subscriptions,
  addSubscription,
  extendToken,
  passwordReset
} = require('../controllers');

const dashboardController = require('../controllers/dashboard.controller');
const publisherMiddleWare = require('../middlewares/publisher.middleware');
const dashboardAuth = require('../middlewares/dashboard-auth.middleware');

module.exports = () => {
  const router = express.Router();

  router.post('/login', publisherMiddleWare, login);
  router.post('/register', publisherMiddleWare, register);
  router.post('/subscriptions', publisherMiddleWare, subscriptions);
  router.post('/subscription', publisherMiddleWare, addSubscription);
  router.post('/extendToken', publisherMiddleWare, extendToken);
  router.post('/passwordReset', publisherMiddleWare, passwordReset);

  router.post('/publisher', dashboardAuth, dashboardController.updatePublisher);
  router.get('/publishers', dashboardAuth, dashboardController.getPublishers);

  return router;
};
