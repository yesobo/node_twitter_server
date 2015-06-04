/// <reference path="./typings/node/node.d.ts"/>

var Twitter = require('Twitter');
var Q = require('q');

module.exports = {
    getFavs: function(count: number, since_id: number) {
      var client = new TwitterClient();
      return client.getFavs(count, since_id);
    },
    getStatus: function(count: number) {
      var client = new TwitterClient();
      return client.getStatus();
    }
}

class TwitterClient {
  private client;
  constructor() {
    this.client = new Twitter({
      consumer_key: 'ccwly2aosThQyNSWsgZdXHUwJ',
      consumer_secret: 'HaAxA0SO3tSwM3XYiKFbso2DVItULq7K7LixSrv8OTwakynBQN',
      access_token_key: '163792645-4N9B1TpZ8jLBQVhn338FBaF8O03gO0etj34omLBZ',
      access_token_secret: 'zs96CJOgM5L1ZLAL95hvwqCegiom9CCu3hsaXdIyee9Fh'
    });
  }

  buildUrl(count: number, since_id: number) {
    var result = 'favorites/list.json';
    if(count > 0 || since_id > 0) {
      result = result + '?';
    }
    if (count > 0) {
      result = result + 'count=' + count;
    }
    if(since_id > 0) {
      if (count > 0) {
        result = result + '&';
      }
      result = result + 'since_id=' + since_id;
    }
    return result;
  }

  getFavs(count: number, since_id: number) {
    var url = this.buildUrl(count, since_id);
    return Q.promise( (resolve, reject, notify) => {
      this.client.get(url, (error, tweets, response) => {
        if (error) {
          reject(error);
        }
        resolve(tweets);
      })
    })
  }

  getStatus() {
    var deferred = Q.defer();
    var url = 'application/rate_limit_status.json?resources=help,favorites,statuses';
    this.client.get(url, (error, status, response) => {
      if(error) {
        deferred.reject(error);
      }
      else {
        deferred.resolve(status);
      }
    });
    return deferred.promise;
  }
}
