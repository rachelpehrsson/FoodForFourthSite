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


/****** EVENTS DISPLAY ******/


app.service("EventsParser", function(){
	var past_events = pastData;
	var upcoming_events = "";
	this.getPastEvents = function(){
			return past_events;
	}


});

//event JSON format
//title
//location
//start_date
//end_date
//main_image
//description

app.controller('PastEventsCtrl', function($scope, $sce, EventsParser){
	// var past_events = pastData;
	$scope.past_events_by_year = EventsParser.getPastEvents();
	$scope.showYear = function(e){ 
		e.currentTarget.parentNode.parentNode.classList.toggle("active");
	}
	$scope.render = function(html){
		return $sce.trustAsHtml(html);
	}
});

/**** CALENDAR ****/
app.controller('CalendarCtrl', function($scope){

});

/**** CONTACT FORM ****/

app.controller('ContactCtrl', function($scope){
	$scope.submit = function(){

	}
});


