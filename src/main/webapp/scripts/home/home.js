'use strict';

angular.module('metadatamanagementApp').config(
    function($stateProvider) {
      $stateProvider.state('home', {
        parent: 'site',
        url: '/',
        data: {
          authorities: []
        },
        views: {
          'content@': {
            templateUrl: 'scripts/home/home.html.tmpl',
            controller: 'HomeController'
          }
        },
        resolve: {
          mainTranslatePartialLoader: ['$translate',
            '$translatePartialLoader',
            function($translate, $translatePartialLoader) {
              $translatePartialLoader.addPart('home');
              return $translate.refresh();
            }
          ]
        }
      });
    })
  //Error Handler for non translated angular js elements.
  .config(function($translateProvider) {
    $translateProvider.useMissingTranslationHandler('translationErrorHandler');
  });