const express = require('express');
const app = express();
const routes = require('./routes')();

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use('/', routes);

app.listen(process.env.PORT || 8080, function() {
  console.log('listening on port ' + (process.env.PORT || 8080) + '!');
});
