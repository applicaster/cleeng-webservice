const basicAuth = require('express-basic-auth');

const express = require('express');
const {
  login,
  register,
  subscriptions,
  addSubscription,
  restoreSubscriptions,
  extendToken,
  passwordReset,
  submitConsent,
  updateCustomerEmail,
  getCustomer,
  generateCustomerToken,
  getFreeAccessToken
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
  router.post(
    '/restoreSubscriptions',
    publisherMiddleWare,
    restoreSubscriptions
  );
  router.post('/extendToken', publisherMiddleWare, extendToken);
  router.post('/passwordReset', publisherMiddleWare, passwordReset);
  router.post('/submitConsent', publisherMiddleWare, submitConsent);
  router.post('/updateCustomerEmail', publisherMiddleWare, updateCustomerEmail);
  router.post('/getCustomer', publisherMiddleWare, getCustomer);
  router.post(
    '/generateCustomerToken',
    publisherMiddleWare,
    generateCustomerToken
  );
  router.post('/getFreeAccessToken', publisherMiddleWare, getFreeAccessToken);

  router.post('/publisher', dashboardAuth, dashboardController.updatePublisher);
  router.get('/publishers', dashboardAuth, dashboardController.getPublishers);
  router.get(
    '/publisher/:publisherId/logs',
    dashboardAuth,
    dashboardController.getPublisherLogs
  );
  router.delete(
    '/publisher/:publisherId/logs',
    dashboardAuth,
    dashboardController.clearPublisherLogs
  );
  router.get(
    '/publisher/:publisherId/activitylogs',
    dashboardAuth,
    dashboardController.getActivityLogs
  );

  return router;
};
