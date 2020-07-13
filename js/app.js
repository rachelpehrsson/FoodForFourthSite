var fffIndex = angular.module('foodFourthIndex', []);

fffIndex.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
}]);

fffIndex.directive('scrollUp',['$window', '$document', '$timeout', '$location', function($window, $document, $timeout, $location) {
	return{
		restrict: "C",
		link: function(element){
			var scrollUp = document.getElementsByClassName('scroll-up')[0];
			document.onscroll = function() {
				var y = $(this).scrollTop();
				if (y > 200) {
					scrollUp.classList.add("active");
				} else {
					scrollUp.classList.remove("active");
					$window.location.hash = "";
				}
			};

			scrollUp.onclick = function(){
				$('html, body').animate({scrollTop:0}, 'slow');
				$window.location.hash = "";
				$('.nav li.active').removeClass("active");
			}
		}
	}
}]);


// $('div.scroll-up.active').click(function(){
// 	$(window).scrollTop(0);
// });

fffIndex.controller('NavBar', ['$scope', '$location', function($scope, $location){
	$scope.isActive = function(page){
		var current = $location.hash() || 'home';
		return page === current?'active':'';
	};
	$scope.appNav = function(event){
		$location.search('e', null);
		$location.hash(event.currentTarget.getAttribute("for"));
		$("li.active").removeClass("active");
		event.currentTarget.parentNode.className = "active";
	}


}]);


/****** EVENTS DISPLAY ******/


fffIndex.service("EventsParser", ['$location', function($location){
	var past_events = pastData;
	var upcoming_events = "";
	this.getPastEvents = function(){
		return past_events;
	}
	this.updateURLWithEvent = function(eventData){
		$location.search('e',eventData.start_date.replace("/", "").replace("/", ""));
	}

}]);

fffIndex.directive("focusedEventPop",['$compile', '$http', function($compile, $http){
	return{
		restrict : 'E',
		//change to url when in a server?
		template:'<div class = "overlay" ng-click="closeFocus($event)"><div class ="focused-event"><div class = "toolbar"><div class = "date">{{ focusedEvent.start_date }}</div><div class = "btn close-focus" ng-click="closeFocus($event)">'+
		'Close</div></div><div class = "main-image" ng-show = "focusedEvent.main_image.length > 0"><img ng-src="{{ focusedEvent.main_image }}"></div><div class = "details"><div class = "title">{{ focusedEvent.title }}</div>'+
		'<div class = "content" ng-bind-html ="render(focusedEvent.description)"></div></div></div></div>'
	}
}]);

//event JSON format
//title
//location
//start_date
//end_date
//main_image
//description

fffIndex.controller('PastEventsCtrl', function($scope, $sce, $element, $compile, $location, EventsParser){
	// var past_events = pastData;
	$scope.past_events_by_year = EventsParser.getPastEvents();
	var search = $location.search();
	$scope.showYear = function(e){ 
		e.currentTarget.parentNode.parentNode.classList.toggle("active");
	}
	$scope.render = function(html){
		return $sce.trustAsHtml(html);
	}
	$scope.eventFocus = function(event){
		$scope.focusedEvent = event;
		EventsParser.updateURLWithEvent(event);
		var newElement = $compile("<focused-event-pop></focused-event-pop>")( $scope );
		$element.append(newElement);
	}

	$scope.closeFocus = function(e){
		if(e.target.className == "overlay" || e.target.classList.contains("close-focus")){
		$location.search('e', null);
		$element[0].getElementsByTagName("focused-event-pop")[0].remove();
	}
	};

	if(search.hasOwnProperty('e') && search['e'].length>0){
		$location.hash('past-events');
		var eventYear = search['e'].substring(search['e'].length-4);
			angular.forEach($scope.past_events_by_year, function(value, key){
			if(value.year == eventYear){
			angular.forEach(value.events, function(value2){	
				if(value2.start_date.replace("/", "").replace("/", "") == search['e'])
					$scope.eventFocus(value2);
				});
			}
		});
		//$location.hash('');
	}
});

/**** CALENDAR ****/
fffIndex.controller('CalendarCtrl', function($scope){

});

/**** CONTACT FORM ****/

//Directive to pause default validation and perform custom validation
fffIndex.directive('validSubmit', [ '$parse', function($parse) {
	return {
			// we need a form controller to be on the same element as this directive
			// in other words: this directive can only be used on a &lt;form&gt;
			require: 'form',
			// one time action per form
			link: function(scope, element, iAttrs, form) {
				form.$submitted = false;
				// get a hold of the function that handles submission when form is valid
				var fn = $parse(iAttrs.validSubmit);
				// register DOM event handler and wire into Angular's lifecycle with scope.$apply
				element.on('submit', function(event) {
					scope.$apply(function() {
						// on submit event, set submitted to true (like the previous trick)
						form.$submitted = true;
						// if form is valid, execute the submission handler function and reset form submission state
						//deactivate submission form to prevent rapid submission
						if (form.$valid) {
							element[0].getElementsByClassName("btn")[0].setAttribute("disabled", "true");
							fn(scope, { $event : event });
							form.$submitted = false;
						}
					});
				});
			}
		};
	}
	]);


// handle form submission when the form is completely valid

fffIndex.controller('ContactCtrl', function($scope, $http, $element){
	$scope.successful = false;

	$scope.submit = function(){
		//send form content to formspree service for submission to fff email
		//Re-enable send button on return
		$http.post("https://formspree.io/mbjzdjlw", $scope.contact).then(function(response){
			$scope.successful = true;
			$element[0].getElementsByClassName("btn")[0].removeAttribute("disabled");
			angular.forEach($scope.contact, function(value, key){
				$scope.contact[key] = "";
			});
		});
	}

});


