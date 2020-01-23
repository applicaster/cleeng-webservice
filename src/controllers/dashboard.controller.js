const Publisher = require('../models/publisher');
const Reqlog = require('../models/reqlog');
const ActivityLog = require('../models/activityLog');
const { addActivityLog, activityTypes } = require('../utils/addActivityLog');
const { compareObjects } = require('../utils/compareObjects');

const getPublishers = async (req, res) => {
  try {
    const publishers = await Publisher.find().sort('name');
    res.status(200).send({ publishers });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message });
  }
};

const updatePublisher = async (req, res) => {
  try {
    const { publisher: _publisher } = req.body;
    const { _id } = _publisher;
    let publisher = _id === '-1' ? null : await Publisher.findOne({ _id });

    if (!publisher) {
      publisher = new Publisher();
      delete _publisher._id;

      await addActivityLog(
        _publisher,
        req.userId,
        activityTypes.ADD_PUBLISHER,
        _publisher
      );
    } else {
      const promises = [];

      if (_publisher.offers && Array.isArray(_publisher.offers)) {
        (_publisher.offers || []).forEach(offer => {
          const oldOffer = (publisher.offers || []).find(
            o => o.offerId === offer.offerId
          );
          if (!oldOffer) {
            promises.push(
              addActivityLog(
                _publisher,
                req.userId,
                activityTypes.ADD_OFFER,
                offer
              )
            );
          } else {
            const diffData = compareObjects(oldOffer, offer, [
              'hideOffer',
              'should_hide_free_ribbon',
              'isAutoRenewable',
              'is_voucher_promoted',
              'authId',
              'offerId',
              'secretKey',
              'appleProductId',
              'androidProductId',
              'rokuProductId',
              'freeAccessLoggedInAuthID'
            ]);
            if (Object.keys(diffData).length > 0) {
              promises.push(
                addActivityLog(
                  _publisher,
                  req.userId,
                  activityTypes.UPDATE_OFFER,
                  diffData
                )
              );
            }
          }
        });

        (publisher.offers || []).forEach(offer => {
          const newOffer = (_publisher.offers || []).find(
            o => o.offerId === offer.offerId
          );
          if (!newOffer) {
            promises.push(
              addActivityLog(
                _publisher,
                req.userId,
                activityTypes.REMOVE_OFFER,
                offer
              )
            );
          }
        });
      }

      const diffData = compareObjects(publisher, _publisher, [
        'name',
        'publisherToken',
        'authToken',
        'secretKey',
        'appStoreSharedKey',
        'logActive'
      ]);
      if (Object.keys(diffData).length > 0) {
        promises.push(
          addActivityLog(
            _publisher,
            req.userId,
            activityTypes.UPDATE_PUBLISHER,
            diffData
          )
        );
      }

      try {
        await Promise.all(promises);
      } catch (err) {
        console.log(err);
      }
    }

    publisher.set(_publisher);
    publisher.updatedAt = new Date();
    publisher.updatedBy = req.userId;

    const result = await publisher.save();

    res.status(200).send({ publisher: result });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getPublisherLogs = async (req, res) => {
  try {
    const { publisherId } = req.params;

    const result = await Reqlog.find({ publisherId }).sort([['reqtime', '-1']]);

    res.status(200).send({ result });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const clearPublisherLogs = async (req, res) => {
  try {
    const { publisherId } = req.params;

    const result = await Reqlog.deleteMany({ publisherId });

    res.status(200).send({ result });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getActivityLogs = async (req, res) => {
  try {
    const { publisherId } = req.params;

    const result = await ActivityLog.find({ publisherId }).sort([
      ['logtime', '-1']
    ]);

    res.status(200).send({ result });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  getPublishers,
  updatePublisher,
  getPublisherLogs,
  clearPublisherLogs,
  getActivityLogs
};
