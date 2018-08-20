const express = require('express');
const app = express();
const routes = require('./routes')();
const db = require('./models');

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use('/', routes);
app.use(express.static(__dirname + '/../admin/build'));
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/../admin/build/index.html');
});

app.listen(process.env.PORT || 8080, function() {
  console.log('listening on port ' + (process.env.PORT || 8080) + '!');
});
