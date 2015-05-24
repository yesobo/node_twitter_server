var mongodb = require('mongodb');
var Q = require('q');

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

    /*
    if(err) throw err;

    twitteries.update(
      { song: 'One Sweet Day' },
      { $set: { artist: 'Mariah Carey ft. Boyz II Men' } },

      function (err, result) {
        if(err) throw err;
        twitteries.find({ weeksAtOne : { $gte: 10 } }).sort({ decade: 1 }).toArray(function (err, docs) {
          if(err) throw err;
          docs.forEach(function (doc) {
            console.log(
              'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] +
              ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
            );
          });

          // Since this is an example, we'll clean up after ourselves.
          twitteries.drop(function (err) {
            if(err) throw err;

            // Only close the connection when your app is terminating.
            db.close(function (err) {
              if(err) throw err;
            });
          });
        });
      }
    );
    */
