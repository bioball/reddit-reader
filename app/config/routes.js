angular.module('reddit', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/', {
    controller: 'mainController',
    templateUrl: '/app/templates/main.html'
  })
  .otherwise({
    redirectTo: '/'
  })
}]);