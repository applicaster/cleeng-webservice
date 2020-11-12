const mongoose = require('mongoose');
let dbURI = 'mongodb://localhost/cleeng-publishers';
if (process.env.MONGODB_URI) {
  dbURI = process.env.MONGODB_URI;
}

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology, true,
});

mongoose.connection.on('connected', () => {
  console.log(`Mongoose Conencted:${dbURI}`);
});

mongoose.connection.on('error', err => {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(function() {
    console.log(
      'Mongoose default connection disconnected through app termination'
    );
    process.exit(0);
  });
});

require('./publisher');
require('./reqlog');
require('./activityLog');
