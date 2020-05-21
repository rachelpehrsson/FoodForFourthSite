var app = angular.module('foodFourth', []);

app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
}]);

app.directive('scrollUp',['$window', '$document', '$timeout', function($window, $document, $timeout) {
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
				}
			};

			scrollUp.onclick = function(){
				$('html, body').animate({scrollTop:0}, 'slow');
			}
		}
	}
}]);


// $('div.scroll-up.active').click(function(){
// 	$(window).scrollTop(0);
// });

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

app.directive("focusedEventPop",['$compile', '$http', function($compile, $http){
	return{
		restrict : 'E',
		//change to url when in a server?
		template:'<div class = "overlay"><div class ="focused-event"><div class = "toolbar"><div class = "date">{{ focusedEvent.start_date }}</div><div class = "btn close-focus" ng-click="closeFocus()">'+
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

app.controller('PastEventsCtrl', function($scope, $sce, $element, $compile, EventsParser){
	// var past_events = pastData;
	$scope.past_events_by_year = EventsParser.getPastEvents();
	$scope.showYear = function(e){ 
		e.currentTarget.parentNode.parentNode.classList.toggle("active");
	}
	$scope.render = function(html){
		return $sce.trustAsHtml(html);
	}
	$scope.eventFocus = function(event){
		$scope.focusedEvent = event;
		var newElement = $compile("<focused-event-pop></focused-event-pop>")( $scope );
		$element.append(newElement);

	}

	$scope.closeFocus = function(){
		$element[0].getElementsByTagName("focused-event-pop")[0].remove();
	};
});

/**** CALENDAR ****/
app.controller('CalendarCtrl', function($scope){

});

/**** CONTACT FORM ****/

//Directive to pause default validation and perform custom validation
app.directive('validSubmit', [ '$parse', function($parse) {
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

app.controller('ContactCtrl', function($scope, $http, $element){
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


