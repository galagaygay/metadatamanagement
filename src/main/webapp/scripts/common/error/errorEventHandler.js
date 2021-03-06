/* This Event Handler handles different Error Events bei the ErrorHandler
Interceptor. The Interceptor catches different Error of the 40X und 500 Errors.
The Interceptor sends an Event based on the catched Error. This Events will be
catched by this Event Handler. The Event Handler creates a Simple Message Toast
based on the Error Event.*/
/* @Author Daniel Katzberg */
'use strict';

angular.module('metadatamanagementApp').run(
  function($rootScope, SimpleMessageToastService, PageTitleService) {
    var ignore404 = 0;
    var ignore401 = 0;

    $rootScope.$on('start-ignoring-404', function() {
      ignore404++;
    });

    $rootScope.$on('stop-ignoring-404', function() {
      ignore404--;
    });

    $rootScope.$on('start-ignoring-401', function() {
      ignore401++;
    });

    $rootScope.$on('stop-ignoring-401', function() {
      ignore401--;
    });

    // Server or network down
    $rootScope.$on('serverNotReachableError', function() {
      SimpleMessageToastService.openAlertMessageToast('global.error.' +
        'server-not-reachable');
    });

    //Client Error 401
    $rootScope.$on('unauthorizedError',
    function(event, response) { // jshint ignore:line
      if (ignore401 === 0) {
        SimpleMessageToastService.openAlertMessageToast('global.error.' +
        'client-error.unauthorized-error', {status: response.status});
      }
    });

    //Client Error 403
    $rootScope.$on('forbiddenError',
    function(event, response) { // jshint ignore:line
      SimpleMessageToastService.openAlertMessageToast('global.error.' +
        'client-error.forbidden-error', {status: response.status});
    });

    //Client Error 404
    $rootScope.$on('notFoundError',
    function(event, response) { // jshint ignore:line
      if (ignore404 === 0) {
        SimpleMessageToastService.openAlertMessageToast('global.error.' +
          'client-error.not-found-error', {status: response.status});
        PageTitleService.setPageTitle('global.title');
      }
    });

    //Server Error 500 to 511
    $rootScope.$on('internalServerError',
    function(event, response) { // jshint ignore:line
      SimpleMessageToastService.openAlertMessageToast('global.error.' +
        'server-error.internal-server-error', {status: response.status});
    });
  });
