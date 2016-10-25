angular.module('App', [])
	.config(function($locationProvider) {
		// Stop normal page requests
    // $locationProvider.html5Mode(true);
	})
	.run(function() {
		// Provides a way to hide angular logic before angular is ready.
		$('.tmp-hide').removeClass('tmp-hide');
	})
	.directive('mailchimpForm', function($http, $log) {
		return {
			// template: '<div ng-transclude></div>',
			// transclude: true,
			link: function(scope, element, attrs) {
				// var mailchimpUrl = 'http://localhost:5000/';
				var mailchimpUrl = 'https://tsko-mailchimp-service.herokuapp.com/';
				var	formDefaults = {
							status: 'subscribed',
							merge_fields: {
								SOURCE: attrs.source,
								// URL: $location.path(), // requires HTML5 mode
								URL: window.location.toString(),
							}, 
						};
				
				scope.processing = false;
				scope.msgs = {};
				scope.formModel = angular.copy(formDefaults);

				// Make sure the server is awake
				// element.hide();
				$http.get(mailchimpUrl+'ping', scope.formModel)
					.then(function(response) {
						console.log(response.data);
						element.show();
					});

				scope.submit = function(form) {
					if ( form.$invalid ) {
						return;
					}
					scope.msgs = {};
					scope.processing = true;

					$http.post(mailchimpUrl+'ithrive/register', scope.formModel)
						.then(function(response) {
							scope.formModel = angular.copy(formDefaults);
							scope.msgs.success = true;
							scope.form.$submitted = false;
						})
						.catch(function(error) {
							console.log(error.data);
							scope.msgs.error = error.data;
						})
						.finally(function() {
							scope.processing = false;
						});
				};
			},
		};
	})