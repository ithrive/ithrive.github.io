angular.module('App', [
		'angularSpinner',
		'ui.bootstrap',
	])
	.config(function($locationProvider) {
		// Stop normal page requests
    // $locationProvider.html5Mode(true);
	})
	.run(function() {
		// Provides a way to hide angular logic before angular is ready.
		$('.tmp-hide').removeClass('tmp-hide');
		
		_.each(knowledgeBaseLookup, function(val, key) {
			val.regex = new RegExp('('+key+')', 'i');
		});
	})
	/*
	 * Add a popover to highlighted keywords.
	 */
	.directive('keyword', function($compile, $rootScope) {
		return {
			restrict: 'E',
			link: function(scope, element, attrs) {

				var details = knowledgeBaseLookup[attrs.value];

				if ( !details ) {
					console.warn('unknown keyword', attrs.value);
					return;
				}

				// Create a scope for the popover
				var popoverScope = $rootScope.$new(false, scope);
				popoverScope.popover = _.extend({
				  templateUrl: 'knowledgePopover.html',
				}, details);

				var $html = $('<span class="keyword" uib-popover-template="popover.templateUrl" popover-append-to-body="true">'+element.text()+'</span>');
				element.replaceWith($html);
				$compile($html)(popoverScope);
			}
		};
	})
	/**
	 * Find known keywords and mark them up so they become popup boxes.
	 *
	 * e.g. "and pilates can" => "and <keyword value="pilates">pilates</keyword> can"
	 */
	.directive('allowKeywords', function($compile) {
		return {
			// transclude: true,
			restrict: 'A',
			scope: {},
			link: function(scope, element, attrs, ctrl, transclude) {

				$('p', element).each(function() {
					var $p = $(this),
							subsituteHtml = html = $p.html();

					_.each(knowledgeBaseLookup, function(val, key) {
						if ( val.found || !subsituteHtml.match(val.regex) ) {
							return;
						}
						// Only match once
						val.found = true;

						subsituteHtml = subsituteHtml.replace(val.regex, function myFunction(match) {
							return '<keyword value="'+key+'">'+match+'</keyword>';
						});
					});

					if ( subsituteHtml.length > html.length ) {
						var $html = $('<p>').html(subsituteHtml);
						$p.replaceWith($html);
						$compile($html)(scope);
					}
				});
			}
		}
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