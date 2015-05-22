var Twitter = require('Twitter');
var Q = require('q');

module.exports = {
    getFavs: function() {
      var client = new TwitterClient();
      return client.getFavs(0);
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

  buildUrl(count: number) {
    var result = '';
    if (count > 0) {
      result = 'favorites/list.json?count=' + count;
    } else {
      result = 'favorites/list.json';
    }
    return result;
  }

  getFavs(count: number) {
    var deferred = Q.defer();
    var url = this.buildUrl(count);
    console.log('get: ' + count);
    this.client.get(url, function(error, tweets, response){
      if(error) {
        deferred.reject(error);
      }
      else {
        deferred.resolve(tweets);
      }
    });
    return deferred.promise;
  }
}
