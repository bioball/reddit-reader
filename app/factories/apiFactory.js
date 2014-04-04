angular.module('reddit')
.factory('apiFactory', ['$http', '$q', function($http, $q){

  // this is a factory just to deal with reddit's potentially quirky API. Since the reddit client I'm building is tiny, this factory is also tiny, but it could grow much larger as the application grows

  return {
    // ideally, opts just gets passed on as URL params, but for some reason reddit
    // doesn't clump category with params. I figured it'd be easier to have one big options hash
    // and deal with the logic here
    getListings: function(subreddits, opts){
      var url = subreddits[0] === 'Front Page' 
        ? 'http://www.reddit.com/hot.json' 
        : 'http://www.reddit.com/r/' + subreddits.join('+') + '/' + opts.category + '.json';
      delete opts.category;
      return $http.get(url, {params: opts});
    }
  };
}]);