const Publisher = require('../models/publisher');

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

module.exports = { getPublishers, updatePublisher };
