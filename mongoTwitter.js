var mongodb = require('mongodb');
var Q = require('q');
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
