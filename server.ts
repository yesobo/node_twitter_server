var Twitter = require('Twitter');

var twitterConsumerKey = 'ccwly2aosThQyNSWsgZdXHUwJ';
var twitterConsumerSecret = 'HaAxA0SO3tSwM3XYiKFbso2DVItULq7K7LixSrv8OTwakynBQN';
var accessTokenKey = '163792645-4N9B1TpZ8jLBQVhn338FBaF8O03gO0etj34omLBZ';
var accessTokenSecret = 'zs96CJOgM5L1ZLAL95hvwqCegiom9CCu3hsaXdIyee9Fh';

var client = new Twitter({
  consumer_key: twitterConsumerKey,
  consumer_secret: twitterConsumerSecret,
  access_token_key: accessTokenKey,
  access_token_secret: accessTokenSecret
});

interface Favourite {
  text: string;
  user: string;
}

function getFavs(count: number) {
  client.get('favorites/list.json?count=' + count, function(error, tweets, response){
    if(error) throw error;
    tweets.forEach(t => {
      console.log("Tweet text: " + t.text);
      console.log("Tweet user: " + t.user.name);
      console.log('\n');
    })
  });
}

getFavs(3);
