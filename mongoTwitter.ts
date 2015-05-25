var mongodb = require('mongodb');
var Q = require('q');
var util = require('util');

class MongoTwitter {
  private user: string;
  private password: string;
  private uri: string;
  private db;
  constructor() {
    console.log('building mongodb instance');
    this.user = 'yesobo';
    this.password = 'arnas747';
    this.uri = 'mongodb://' + this.user + ':' + this.password + '@ds031862.mongolab.com:31862/twitterites';
  }

  connectAndInsert(insertArray: Array<Object>) {
    var deferred = Q.defer();
    var that = this;
    mongodb.MongoClient.connect(this.uri, function(err, db) {
      if(err) {
        console.log('error on mongodb connection');
        deferred.reject(err);
      }
      that.db = db;
      that.insertArray(insertArray).then(that.disconnect).then(function() {
        deferred.resolve('ok');
      });
    })
    return deferred.promise;
  }

  insertArray(myarray: Array<Object>) {
    var deferred = Q.defer();
    var twitteries = this.db.collection('twitteries');
    twitteries.insert(myarray, function(err, result) {
      console.log('insert callback');
      if(err) {
        deferred.resolve(err);
      }
      deferred.resolve(result);
    });
    return deferred.promise;
  }

  getLastFav() {
    var deferred = Q.defer();
    var that = this;
    mongodb.MongoClient.connect(this.uri, function(err, db) {
      if(err) {
        console.log('error on mongodb connection');
        deferred.reject(err);
      }
      that.db = db;
      var twitterites = db.collection('twitteries');
      twitterites.findOne({}, { "sort": [['id',-1]] }, (err, document) => {
        console.log("Found #" + document.id);
        deferred.resolve(document);
      });
    })
    return deferred.promise;
  }

  getNewFavs(lastId: number) {
    var deferred = Q.defer();
    var that = this;
    mongodb.MongoClient.connect(this.uri, function(err, db) {
      if(err) {
        console.log('error on mongodb connection');
        deferred.reject(err);
      }
      that.db = db;
      var twitterites = db.collection('twitteries');
      twitterites.find({"id": { $gt: lastId } }, { "sort": [['id',-1]] }).toArray(function(err, results) {
        console.log('found ' + results.length + ' new twitterites.');
        deferred.resolve(results);
      });
    })
    return deferred.promise;
  }

  getAllFavs() {
    var deferred = Q.defer();
    var that = this;
    mongodb.MongoClient.connect(this.uri, function(err, db) {
      if(err) {
        console.log('error on mongodb connection');
        deferred.reject(err);
      }
      that.db = db;
      var twitterites = db.collection('twitteries');
      twitterites.find({}, { "sort": [['id',-1]] }).toArray(function(err, results) {
        console.log('found ' + results.length + ' twitterites.');
        deferred.resolve(results);
      });
    })
    return deferred.promise;
  }

  disconnect() {
    console.log('disconnecting ...' + this.db);
    if(this.db) {
      this.db.close(function(err) {
        if(err) throw err;
        console.log('disconnected from mongolab');
      });
    }
  }

}

module.exports = MongoTwitter;
