angular.module('reddit')
.factory('listingsFactory', ['$q', 'apiFactory', function($q, apiFactory){

  // this is a factory to just handle the current listings that we have, 
  // and interacts with the API factory.

  // The "currentListings" array will be bound to $scope in the controller
  var currentListings = [];
  
  // keep track of all current subReddits.
  var subReddits = {};

  // the current category. Defaults to "hot"
  var currentCategory = 'hot'

  // these are used for handling pagination
  var before;
  var after;
  var count = 0;

  // link fetching utility funciton
  var fetchListings = function(subreddit, opts){
    var deferred   = $q.defer();
    var subreddits = handleSubredditQueryArray(subreddit) 
    opts           = opts || {};
    opts.category  = currentCategory;

    apiFactory.getListings(subreddits, opts)
    .success(function(results){
      handleQueryResults(subreddit, results);
      deferred.resolve(results.data.children);
    })
    .error(function(err){
      deferred.reject(err);
    })

    return deferred.promise;
  };

  var handleSubredditQueryArray = function(subreddit){
    if (subreddit) {
      return Object.keys(subReddits).concat(subreddit)
    } else {
      return Object.keys(subReddits)
    }
  }

  var handleQueryResults = function(subreddit, results){
    if (subreddit){ subReddits[subreddit] = true; }
    currentListings = results.data.children;
    before          = results.data.after;
    after           = results.data.before;
  };

  // this is necessary to work with reddit's quirky pagination API. There doesn't seem to be a particular reason to the count variable's math
  var handleCount = function(direction){
    if(count % 25 === 1){
      count = direction === 'next' ? count - 1 : count - 25;
    } else {
      count = direction === 'next' ? count + 25 : count + 1;
    }
  };

  return {
    currentListings: currentListings,

    subReddits: subReddits,

    canGetPreviousPage: function(){
      return !!after;
    },

    fetchNewSubreddit: function(subreddit){
      count = 0;
      var deferred = $q.defer();
      if(subReddits['Front Page']){
        delete subReddits['Front Page'];
      }
      fetchListings(subreddit)
      .then(function(listings){
        deferred.resolve(listings);
      }, deferred.reject.bind(deferred));
      return deferred.promise;
    },

    removeSubreddit: function(subreddit){
      delete subReddits[subreddit];
      return fetchListings();
    },

    fetchFrontPage: function(){
      return fetchListings('Front Page')
    },

    fetchNextPage: function(){
      handleCount('next');
      return fetchListings(null, {
        after: before,
        count: count
      })
    },

    fetchPreviousPage: function(){
      handleCount('previous');
      return fetchListings(null, {
        before: after,
        count: count
      })
    }
  };

}]);