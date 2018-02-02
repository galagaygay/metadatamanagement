/* global Blob */
'use strict';

angular.module('metadatamanagementApp')
  .controller('SurveyDetailController',
    function(entity, LanguageService, CleanJSObjectService,
      PageTitleService, $state, ToolbarHeaderService, SurveySearchService,
      SurveyAttachmentResource, Principal, SimpleMessageToastService,
      SearchResultNavigatorService, $stateParams,
      SurveyResponseRateImageUploadService) {
      SearchResultNavigatorService.registerCurrentSearchResult(
          $stateParams['search-result-index']);
      var ctrl = this;
      ctrl.searchResultIndex = $stateParams['search-result-index'];
      ctrl.counts = {};
      entity.promise.then(function(result) {
        var currenLanguage = LanguageService.getCurrentInstantly();
        var secondLanguage = currenLanguage === 'de' ? 'en' : 'de';
        PageTitleService.setPageTitle('survey-management.detail.title', {
          title: result.title[currenLanguage] ? result.title[currenLanguage]
          : result.title[secondLanguage],
          surveyId: result.id
        });
        ToolbarHeaderService.updateToolbarHeader({
          'stateName': $state.current.name,
          'id': result.id,
          'number': result.number,
          'studyId': result.studyId,
          'studyIsPresent': CleanJSObjectService.
          isNullOrEmpty(result.study) ? false : true,
          'projectId': result.dataAcquisitionProjectId});
        if (result.release || Principal.hasAuthority('ROLE_PUBLISHER') ||
            Principal.hasAuthority('ROLE_DATA_PROVIDER')) {
          ctrl.survey = result;
          ctrl.study = result.study;
          ctrl.counts.dataSetsCount = result.dataSets.length;
          if (ctrl.counts.dataSetsCount === 1) {
            ctrl.dataSet = result.dataSets[0];
          }
          SurveySearchService.countBy('dataAcquisitionProjectId',
          ctrl.survey.dataAcquisitionProjectId)
          .then(function(surveysCount) {
            ctrl.counts.surveysCount = surveysCount.count;
          });
          ctrl.counts.instrumentsCount = result.instruments.length;
          if (ctrl.counts.instrumentsCount === 1) {
            ctrl.instrument = result.instruments[0];
          }
          SurveyAttachmentResource.findBySurveyId({
            id: ctrl.survey.id
          }).$promise.then(
            function(attachments) {
              if (attachments.length > 0) {
                ctrl.attachments = attachments;
              }
            });
          ctrl.counts.publicationsCount = result.relatedPublications.length;
          if (ctrl.counts.publicationsCount === 1) {
            ctrl.relatedPublication = result.relatedPublications[0];
          }
          SurveyResponseRateImageUploadService.getImage(
            ctrl.survey.id, ctrl.survey.number, currenLanguage)
            .then(function(image) {
              ctrl.responseRateImage = new Blob(
                [image],{type: 'image/svg+xml'});
            });
        } else {
          SimpleMessageToastService.openSimpleMessageToast(
            'survey-management.detail.not-released-toast', {id: result.id}
          );
        }
      });
    });
