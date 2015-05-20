var Express = require('express');
var FavsService = require('./favsSrv.js');

var app = Express();

app.get('/', (req, res) => {
  FavsService.getFavs(3).then( data => {
    res.send(data);
  });
});

var server = app.listen(3000, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Favos server listening at http://%s:%s', 'localhost', port);
});
