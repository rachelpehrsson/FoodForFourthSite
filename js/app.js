var app = angular.module('foodFourth', []);

app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode({
  enabled: true,
  requireBase: false
  });
}]);

app.controller('NavBar', ['$scope', '$location', function($scope, $location){
	$scope.isActive = function(page){
		var current = $location.path().substring(1) || 'home';
		return page === current?'active':'';
	};
	$scope.appNav = function(event){
		$location.hash(event.currentTarget.getAttribute("for"));
		event.currentTarget.parentNode.className = "active";
	}



}]);

