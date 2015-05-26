var Twitter = require('Twitter');
var MongoTwitterClass = require('./mongoTwitter');
var Q = require('q');
module.exports = {
    getFavs: function (count, max_id) {
        var client = new TwitterClient();
        return client.getFavs(count, max_id);
    },
    getStatus: function (count) {
        var client = new TwitterClient();
        return client.getStatus();
    },
    getAllFavs: function (count) {
        var client = new TwitterClient();
        return client.getAllFavs();
    }
};
var TwitterClient = (function () {
    function TwitterClient() {
        this.client = new Twitter({
            consumer_key: 'ccwly2aosThQyNSWsgZdXHUwJ',
            consumer_secret: 'HaAxA0SO3tSwM3XYiKFbso2DVItULq7K7LixSrv8OTwakynBQN',
            access_token_key: '163792645-4N9B1TpZ8jLBQVhn338FBaF8O03gO0etj34omLBZ',
            access_token_secret: 'zs96CJOgM5L1ZLAL95hvwqCegiom9CCu3hsaXdIyee9Fh'
        });
    }
    TwitterClient.prototype.buildUrl = function (count, max_id) {
        console.log('building url with max_id: ' + max_id);
        var result = 'favorites/list.json';
        if (count > 0 || max_id > 0) {
            result = result + '?';
        }
        if (count > 0) {
            result = result + 'count=' + count;
        }
        if (max_id > 0) {
            console.log('adding max_id paramteter ');
            if (count > 0) {
                result = result + '&';
            }
            result = result + 'max_id=' + max_id;
        }
        return result;
    };
    TwitterClient.prototype.getFavs = function (count, max_id) {
        var deferred = Q.defer();
        var url = this.buildUrl(count, max_id);
        console.log('get from: ' + url);
        this.client.get(url, function (error, tweets, response) {
            if (error) {
                deferred.reject(error);
            }
            else {
                deferred.resolve(tweets);
            }
        });
        return deferred.promise;
    };
    TwitterClient.prototype.getAllFavs = function () {
        var mongoTwitter = new MongoTwitterClass();
        return mongoTwitter.getAllFavs();
    };
    TwitterClient.prototype.getStatus = function () {
        var deferred = Q.defer();
        var url = 'application/rate_limit_status.json?resources=help,favorites,statuses';
        this.client.get(url, function (error, status, response) {
            if (error) {
                deferred.reject(error);
            }
            else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    };
    return TwitterClient;
})();
