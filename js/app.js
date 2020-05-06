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
		$("li.active").removeClass("active");
		event.currentTarget.parentNode.className = "active";
	}


}]);

//event JSON format
//title
//location
//start-date
//end-date
//main-image
//description

/****** EVENTS DISPLAY ******/


app.service("EventsParser", function(){
	var past_events = pastData;
	var upcoming_events = "";
	this.getPastEvents = function(){
			return past_events;

		// var reader = new FileReader();
		// reader.onload = function () {
		// 	return reader.result;
		// }
		// reader.readAsDataURL(type_path);

		// $http.get(type_path, function(data){
		// 	// if(type == EventTypes.past){
		// 	// 	return data.past_events;
		// 	// }
		// 	// else{
		// 	// 	return data.upcoming_events;
		// 	// }
		// 	return data;
		// });
		
	}
});

// app.directive('pastEvents', [
//   function () {
//     return {
//       restrict: 'E',
//       scope: {
//         contentId: '=',
//         contentTitle: '='
//       },
//       templateUrl: 'past-events.html',
//       controller: 'PastEventsCtrl',
//       controllerAs: 'past_events'
//     };
//   }]);

app.controller('PastEventsCtrl', function($scope, EventsParser){
	// var past_events = pastData;
	$scope.past_events_by_year = EventsParser.getPastEvents();
	$scope.showYear = function(event){ 
		event.currentTarget.parentNode.parentNode.classList.toggle("active");
	}
});


