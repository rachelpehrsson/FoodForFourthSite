var app = angular.module('foodFourth', []);

app.controller('NavBar', ['$scope', '$location', function($scope, $location){
	$scope.isActive = function(page){
		var current = $location.path().substring(1) || 'home';
		return page === current?'active':'';
	};
	$scope.missionNav = function(){
		$location.url("#mission");
	}
}]);
