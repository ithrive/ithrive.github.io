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
	.directive('mailchimpForm', function($http, $log, $location) {
		return {
			template: 
				'<div>'+
					'<div ng-transclude ng-if="ready"></div>'+
					'<span us-spinner="{radius:10, width:1, length:8}" spinner-on="!ready"></span>'+
				'</div>',
			transclude: true,
			// scope: {},
			link: function(scope, element, attrs) {
				// var mailchimpUrl = 'http://localhost:5000/';
				var mailchimpUrl = 'https://tsko-mailchimp-service.herokuapp.com/';
				var	location = window.location.toString(),
						formDefaults = {
							status: 'subscribed',
							merge_fields: {
								SOURCE: attrs.source,
								// URL: $location.path(), // requires HTML5 mode
								URL: location,
							}, 
						};

				scope.ready = false;

				console.log(attrs.interest);
				if ( attrs.interest ) {
					formDefaults.merge_fields.INTEREST = attrs.interest;
				}
				
				scope.processing = false;
				scope.msgs = {};
				scope.formModel = angular.copy(formDefaults);
				scope.formModel.email_address = 'torben.sko@gmail.com';
				console.log(scope.formModel);

				// Make sure the server is awake
				// element.hide();
				$http.get(mailchimpUrl+'ping')
					.then(function(response) {
						// element.show();
						scope.ready = true;
					});

				scope.submit = function(form) {
					console.log('submit');
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