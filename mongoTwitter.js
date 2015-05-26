var mongodb = require('mongodb');
var Q = require('q');
var util = require('util');
var MongoTwitter = (function () {
    function MongoTwitter() {
        console.log('building mongodb instance');
        this.user = 'yesobo';
        this.password = 'arnas747';
        this.uri = 'mongodb://' + this.user + ':' + this.password + '@ds031862.mongolab.com:31862/twitterites';
    }
    MongoTwitter.prototype.connectAndInsert = function (insertArray) {
        var deferred = Q.defer();
        var that = this;
        mongodb.MongoClient.connect(this.uri, function (err, db) {
            if (err) {
                console.log('error on mongodb connection');
                deferred.reject(err);
            }
            that.db = db;
            that.insertArray(insertArray).then(that.disconnect).then(function () {
                deferred.resolve('ok');
            });
        });
        return deferred.promise;
    };
    MongoTwitter.prototype.insertArray = function (myarray) {
        var deferred = Q.defer();
        var twitteries = this.db.collection('twitteries');
        twitteries.insert(myarray, function (err, result) {
            console.log('insert callback');
            if (err) {
                deferred.resolve(err);
            }
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    MongoTwitter.prototype.getLastFav = function () {
        var deferred = Q.defer();
        var that = this;
        mongodb.MongoClient.connect(this.uri, function (err, db) {
            if (err) {
                console.log('error on mongodb connection');
                deferred.reject(err);
            }
            that.db = db;
            var twitterites = db.collection('twitteries');
            twitterites.findOne({}, { "sort": [['id', -1]] }, function (err, document) {
                console.log("Found #" + document.id);
                deferred.resolve(document);
            });
        });
        return deferred.promise;
    };
    MongoTwitter.prototype.getNewFavs = function (lastId) {
        var deferred = Q.defer();
        var that = this;
        mongodb.MongoClient.connect(this.uri, function (err, db) {
            if (err) {
                console.log('error on mongodb connection');
                deferred.reject(err);
            }
            that.db = db;
            var twitterites = db.collection('twitteries');
            twitterites.find({ "id": { $gt: lastId } }, { "sort": [['id', -1]] }).toArray(function (err, results) {
                console.log('found ' + results.length + ' new twitterites.');
                deferred.resolve(results);
            });
        });
        return deferred.promise;
    };
    MongoTwitter.prototype.getAllFavs_old = function () {
        var deferred = Q.defer();
        var that = this;
        mongodb.MongoClient.connect(this.uri, function (err, db) {
            if (err) {
                console.log('error on mongodb connection');
                deferred.reject(err);
            }
            that.db = db;
            var twitterites = db.collection('twitteries');
            twitterites.find({}, { "sort": [['id', -1]] }).toArray(function (err, results) {
                console.log('found ' + results.length + ' twitterites.');
                deferred.resolve(results);
            });
        });
        return deferred.promise;
    };
    MongoTwitter.prototype.connect = function () {
        console.log('connect: INI');
        return Q.nfcall(mongodb.MongoClient.connect, this.uri);
    };
    MongoTwitter.prototype.getTwitterites = function (db) {
        return Q.Promise(function (resolve, reject, notify) {
            var twitterites = db.collection('twitteries');
            twitterites.find({}, { "sort": [['id', -1]] }).toArray(function (err, results) {
                if (err) {
                    reject(err);
                }
                console.log('found ' + results.length + ' twitterites.');
                resolve(results);
            });
        });
    };
    MongoTwitter.prototype.getAllFavs = function () {
        console.log('getAllFavs: INI');
        return this.connect()
            .then(this.getTwitterites);
    };
    MongoTwitter.prototype.disconnect = function () {
        console.log('disconnecting ...' + this.db);
        if (this.db) {
            this.db.close(function (err) {
                if (err)
                    throw err;
                console.log('disconnected from mongolab');
            });
        }
    };
    return MongoTwitter;
})();
module.exports = MongoTwitter;
