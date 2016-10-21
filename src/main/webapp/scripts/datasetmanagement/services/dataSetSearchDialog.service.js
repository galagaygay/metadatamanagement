/* global document*/

'use strict';
angular.module('metadatamanagementApp')
  .service('DataSetSearchDialogService',
    function($mdDialog, blockUI, DataSetSearchResource, CleanJSObjectService) {
      var dataSets = [];
      var showDialog = function() {
        var dialogParent = angular.element(document.body);
        $mdDialog.show({
          controller: 'DataSetSearchDialogController',
          controllerAs: 'dataSetSearchDialogController',
          parent: dialogParent,
          clickOutsideToClose: true,
          locals: {
            dataSets: dataSets
          },
          templateUrl: 'scripts/datasetmanagement/views/' +
            'dataSetSearchDialog.html.tmpl',
        });
      };
      var findByVariableId = function(variableId) {
        blockUI.start();
        DataSetSearchResource.findByVariableId(variableId)
          .then(function(items) {
            if (!CleanJSObjectService.isNullOrEmpty(items)) {
              dataSets = items.hits.hits;
              showDialog();
            }
          }).finally(function() {
            blockUI.stop();
          });
      };
      var findBySurveyTitle = function(surveyTitle) {
        blockUI.start();
        DataSetSearchResource.findBySurveyTitle(surveyTitle)
          .then(function(items) {
            if (!CleanJSObjectService.isNullOrEmpty(items)) {
              dataSets = items.hits.hits;
              showDialog();
            }
          }).finally(function() {
            blockUI.stop();
          });
      };
      var findDataSets = function(dataSetIds) {
        blockUI.start();
        DataSetSearchResource.findDataSets(dataSetIds)
          .then(function(items) {
            if (!CleanJSObjectService.isNullOrEmpty(items)) {
              dataSets = items.docs;
              showDialog();
            }
          }).finally(function() {
            blockUI.stop();
          });
      };
      return {
        findByVariableId: findByVariableId,
        findBySurveyTitle: findBySurveyTitle,
        findDataSets: findDataSets
      };
    });
