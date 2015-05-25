var Express = require('express');
var FavsService = require('./favsSrv.js');
var app = Express();
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.get('/', function (req, res) {
    FavsService.getAllFavs().then(function (data) {
        res.send(data);
    });
});
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Favos server listening at http://%s:%s', 'localhost', port);
});
