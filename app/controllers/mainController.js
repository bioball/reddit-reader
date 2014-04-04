angular.module('reddit')
.controller('mainController', ['$scope', '$routeParams', 'listingsFactory', function($scope, $routeParams, listingsFactory){

  if(!listingsFactory.currentListings.length){
    listingsFactory.fetchFrontPage().then(function(listings){
      $scope.listings = listings;
    });
  }

  $scope.subReddits = listingsFactory.subReddits;

  $scope.canGetPreviousPage = listingsFactory.canGetPreviousPage;

  $scope.getSubreddit = function(subredditName){
    $scope.subredditName = '';
    listingsFactory.fetchNewSubreddit(subredditName).then(function(listings){
      $scope.listings = listings;
    }, function(err){
      alert("something went wrong!");
    });
  };

  $scope.next = function(event){
    event.preventDefault();
    listingsFactory.fetchNextPage().then(function(listings){
      $scope.listings = listings;
    }, function(err){
      alert("something went wrong!");
    });
  };

  $scope.previous = function(event){
    event.preventDefault();
    listingsFactory.fetchPreviousPage().then(function(listings){
      $scope.listings = listings;
    }, function(err){
      alert("something went wrong!");
    });
  };

  $scope.removeSubreddit = function(subreddit){
    if(Object.keys(listingsFactory.subReddits).length === 1){
      alert("Can't have zero subreddits!");
      return;
    }
    listingsFactory.removeSubreddit(subreddit).then(function(listings){
      $scope.listings = listings;
    }, function(err){
      alert("something went wrong!");
    });
  };

}]);