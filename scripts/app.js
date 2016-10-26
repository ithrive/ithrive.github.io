angular.module('App', [
		'angularSpinner',
	])
	.config(function($locationProvider) {
		// Stop normal page requests
    // $locationProvider.html5Mode(true);
	})
	.run(function() {
		// Provides a way to hide angular logic before angular is ready.
		$('.tmp-hide').removeClass('tmp-hide');
	})
	.directive('mailchimpForm', function($http, $log, $timeout) {
		return {
			template: '<span us-spinner="{radius:10, width:1, length:8}" spinner-on="!ready"></span>',
			transclude: true,
			scope: {},
			link: function(scope, element, attrs, ctrl, transclude) {
				// var mailchimpUrl = 'http://localhost:5000/';
				var mailchimpUrl = 'https://tsko-mailchimp-service.herokuapp.com/';
				var	location = window.location.toString(),
						formDefaults = {
							status: 'subscribed',
							merge_fields: {
								SOURCE: attrs.source,
								URL: location, // $location.path(), - requires HTML5 mode
							}, 
						};

				scope.ready = false;

				if ( attrs.interest ) {
					formDefaults.merge_fields.INTEREST = attrs.interest;
				}
				
				scope.processing = false;
				scope.msgs = {};
				var model = scope.formModel = angular.copy(formDefaults);

				// Make sure the server is awake
				$http.get(mailchimpUrl+'ping')
					.then(function(response) {
						scope.ready = true;
						transclude(scope, function (clone) {
	            element.append(clone);
	          });
					});

				scope.submit = function(form) {
					if ( form.$invalid ) {
						return;
					}
					scope.msgs = {};
					scope.processing = true;

					$http.post(mailchimpUrl+'ithrive/register', model)
						.then(function(response) {
							model = angular.copy(formDefaults);
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