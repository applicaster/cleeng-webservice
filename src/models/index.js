const mongoose = require('mongoose');
const url = require('url');
const querystring = require('querystring');


let dbURI = 'mongodb://localhost/cleeng-publishers';
mongooseOpts = {
  useNewUrlParser: true,

}
if (process.env.MONGODB_URI) {
  dbURI = process.env.MONGODB_URI;

  let dbURLParams = querystring.parse(url.parse(dbURI).query)
  mongooseOpts["replicaSet"] = dbURLParams["replicaSet"]
  mongooseOpts["authSource"] = dbURLParams["authSource"]
}

mongoose.connect(dbURI, mongooseOpts);

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
