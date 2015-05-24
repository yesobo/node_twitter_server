var FavsSrv = require('./favsSrv');
var MongoTwitterClass = require('./mongoTwitter');
var Q = require('q');

// returns the id of the last favourite on response
function getFavs(count: number, max_id: number) {
  var deferred = Q.defer();
  console.log('max_id is: ' + max_id);
  FavsSrv.getFavs(count, max_id)
  .then(function(favs) {
    console.log('favs got: ' + favs.length);
    var mongoTwitter = new MongoTwitterClass();
    mongoTwitter.connectAndInsert(favs).then( () => {
      console.log('insertion finished');
      deferred.resolve(favs[favs.length - 1].id);
    })
    .catch(function(error) {
      deferred.reject(error);
    })
  })
  .catch(function(error) {
    deferred.reject(error);
  });
  return deferred.promise;
}

function getFavsWithRetries(favs_left, max_id) {
  favs_left || (favs_left = 200);
  max_id || (max_id = 251632125579759600);
  console.log('favs_left: ' + favs_left);
  if(favs_left > 0) {
    console.log('calling getFavs with max_id: ' + max_id);
    return getFavs(200, max_id).then(function(new_max_id) {
      console.log('new max id is: ' + new_max_id);
      return Q.delay(5000).then(function() {
        console.log('new call');
        return getFavsWithRetries(favs_left - 200, new_max_id - 1);
      })
    })
  }
}

function main() {

  /*
  FavsSrv.getStatus().then(function(status) {
    console.log('status: ' + JSON.stringify(status, null, 4));
  })
  */
  // max rate limit: 200
  var favs_left = 1580;
  var max_id = 0;
  getFavsWithRetries(0, 0);

}

main();
