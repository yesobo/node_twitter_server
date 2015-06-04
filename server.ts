var Express = require('express');
var TwitterSrv = require('./twitterSrv');
var BackupService = require('./backup');

var app = Express();

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/favorites/:since_id', (req, res) => {
  var all_new = [];
  var since_id = req.param('since_id');
  var last_saved_id = since_id;

  function favsLoop(promise, fn) {
    return promise.then(fn).then( (wrapper) => {
      if(!wrapper.done) {
        console.log('calling favsLoop:' + wrapper.value);
        return favsLoop(TwitterSrv.getFavs(20, wrapper.value), fn);
      } else {
        console.log('cycle ended');
        return wrapper.value;
      }
    })
  }

  favsLoop(TwitterSrv.getFavs(20, since_id), function(data) {
    console.log('looking for favourites after ' + since_id);
    console.log('data.lenght is: ' + data.length);
    all_new.push(data);
    var next_id = 0;
    if (data.length > 0) {
      next_id = data[0].id + 1;
    }
    return {
      done: data.length < 20,
      value: next_id
    }
  }).done( () => {
    res.send(all_new);
  })
});

var server = app.listen(3000, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Favos server listening at http://%s:%s', 'localhost', port);
});
