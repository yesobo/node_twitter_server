/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />
var TwitterSrv = require('../twitterSrv');
var expect = require('chai').expect;
describe('twitterSrv', function () {
    describe('getFavs', function () {
        var last_tweet_id = null;
        var before_last_tweet_id = null;
        describe('count parameter not provided', function () {
            describe('since_id parameter not provided', function () {
                it('should return 20 tweets as API defines', function () {
                    return TwitterSrv.getFavs().then(function (data) {
                        last_tweet_id = data[0].id;
                        before_last_tweet_id = data[1].id;
                        expect(data.length).equals(20);
                    });
                });
            });
        });
        describe('count parameter is 0', function () {
            it('should return 20 tweets as API defines', function () {
                return TwitterSrv.getFavs(0).then(function (data) {
                    expect(data.length).equals(20);
                });
            });
            describe('since_id parameter provided is the id of the before last tweet', function () {
                beforeEach(function () {
                    if (last_tweet_id === null || before_last_tweet_id === null) {
                        return TwitterSrv.getFavs().then(function (data) {
                            last_tweet_id = data[0].id;
                            before_last_tweet_id = data[1].id;
                        });
                    }
                });
                it('should return only last and before last tweets', function () {
                    return TwitterSrv.getFavs(0, before_last_tweet_id).then(function (data) {
                        expect(data.length).equals(2);
                        expect(data[0].id).equals(last_tweet_id);
                        expect(data[1].id).equals(before_last_tweet_id);
                    });
                });
            });
        });
        describe('count parameter provided', function () {
            describe('count parameter equals 2', function () {
                var last_2_tweets = null;
                beforeEach(function () {
                    return TwitterSrv.getFavs(2).then(function (data, err) {
                        if (err) {
                            console.log('error getting last favourites tweet: ' + err);
                        }
                        else {
                            last_2_tweets = data;
                            if (last_tweet_id === null) {
                                last_tweet_id = last_2_tweets[0];
                            }
                        }
                    });
                });
                it('should return 2 tweets', function () {
                    expect(last_2_tweets.length).equals(2);
                });
                it('should return tweets ordered by id', function () {
                    expect(last_2_tweets[0].id > last_2_tweets[1].id).to.be.ok;
                });
                it('should return the last tweet in first position', function () {
                    expect(last_2_tweets[0].id).equal(last_tweet_id);
                });
            });
        });
    });
});
