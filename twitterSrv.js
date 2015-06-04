/// <reference path="./typings/node/node.d.ts"/>
var Twitter = require('Twitter');
var Q = require('q');
module.exports = {
    getFavs: function (count, since_id) {
        var client = new TwitterClient();
        return client.getFavs(count, since_id);
    },
    getStatus: function (count) {
        var client = new TwitterClient();
        return client.getStatus();
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
    TwitterClient.prototype.buildUrl = function (count, since_id) {
        var result = 'favorites/list.json';
        if (count > 0 || since_id > 0) {
            result = result + '?';
        }
        if (count > 0) {
            result = result + 'count=' + count;
        }
        if (since_id > 0) {
            if (count > 0) {
                result = result + '&';
            }
            result = result + 'since_id=' + since_id;
        }
        return result;
    };
    TwitterClient.prototype.getFavs = function (count, since_id) {
        var _this = this;
        var url = this.buildUrl(count, since_id);
        return Q.promise(function (resolve, reject, notify) {
            _this.client.get(url, function (error, tweets, response) {
                if (error) {
                    reject(error);
                }
                resolve(tweets);
            });
        });
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
