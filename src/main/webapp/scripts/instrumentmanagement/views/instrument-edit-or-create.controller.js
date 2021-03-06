/* global _, bowser*/
'use strict';

angular.module('metadatamanagementApp')
  .controller('InstrumentEditOrCreateController',
    function(entity, PageTitleService, $timeout,
      $state, ToolbarHeaderService, Principal, SimpleMessageToastService,
      CurrentProjectService, InstrumentIdBuilderService, InstrumentResource,
      $scope, SurveyIdBuilderService,
      ElasticSearchAdminService, $mdDialog, $transitions, StudyResource,
      CommonDialogsService, LanguageService, AvailableInstrumentNumbersResource,
      InstrumentAttachmentResource, $q, StudyIdBuilderService, SearchDao,
      DataAcquisitionProjectResource, $rootScope) {
      var ctrl = this;
      ctrl.surveyChips = [];
      var updateToolbarHeaderAndPageTitle = function() {
        if (ctrl.createMode) {
          PageTitleService.setPageTitle(
            'instrument-management.edit.create-page-title', {
            instrumentId: ctrl.instrument.id
          });
        } else {
          PageTitleService.setPageTitle(
            'instrument-management.edit.edit-page-title', {
            instrumentId: ctrl.instrument.id
          });
        }
        $rootScope.$broadcast('start-ignoring-404');
        StudyResource.get({id: ctrl.instrument.studyId}).$promise
          .then(function(study) {
          ToolbarHeaderService.updateToolbarHeader({
            'stateName': $state.current.name,
            'instrumentId': ctrl.instrument.id,
            'studyId': ctrl.instrument.studyId,
            'instrumentNumber': ctrl.instrument.number,
            'studyIsPresent': study != null,
            'projectId': ctrl.instrument.dataAcquisitionProjectId,
            'enableLastItem': !ctrl.createMode,
            'instrumentIsPresent': !ctrl.createMode
          });
        }).catch(function() {
          ToolbarHeaderService.updateToolbarHeader({
            'stateName': $state.current.name,
            'instrumentId': ctrl.instrument.id,
            'studyId': ctrl.instrument.studyId,
            'instrumentNumber': ctrl.instrument.number,
            'studyIsPresent': false,
            'projectId': ctrl.instrument.dataAcquisitionProjectId,
            'enableLastItem': !ctrl.createMode,
            'instrumentIsPresent': !ctrl.createMode
          });
        }).finally(function() {
          $rootScope.$broadcast('stop-ignoring-404');
        });
      };

      var handleReleasedProject = function() {
        SimpleMessageToastService.openAlertMessageToast(
          'instrument-management.edit.choose-unreleased-project-toast');
        $timeout(function() {
          $state.go('search', {
            lang: LanguageService.getCurrentInstantly(),
            type: 'instruments'
          });
        }, 1000);
      };

      ctrl.initSurveyChips = function() {
        ctrl.surveyChips = [];
        ctrl.instrument.surveyNumbers.forEach(
          function(surveyNumber) {
            ctrl.surveyChips.push({
              id: SurveyIdBuilderService.buildSurveyId(
                ctrl.instrument.dataAcquisitionProjectId,
                surveyNumber
              ),
              number: surveyNumber
            });
          });
      };

      var init = function() {
        if (Principal.hasAnyAuthority(['ROLE_PUBLISHER',
            'ROLE_DATA_PROVIDER'])) {
          if (!bowser.msie) {
            if (entity) {
              entity.$promise.then(function(instrument) {
                ctrl.createMode = false;
                DataAcquisitionProjectResource.get({
                  id: instrument.dataAcquisitionProjectId
                }).$promise.then(function(project) {
                  if (project.release != null) {
                    handleReleasedProject();
                  } else {
                    ctrl.instrument = instrument;
                    ctrl.initSurveyChips();
                    ctrl.loadAttachments();
                    updateToolbarHeaderAndPageTitle();
                    $scope.registerConfirmOnDirtyHook();
                  }
                });
              });
            } else {
              if (CurrentProjectService.getCurrentProject() &&
              !CurrentProjectService.getCurrentProject().release) {
                ctrl.createMode = true;
                AvailableInstrumentNumbersResource.get({
                  id: CurrentProjectService.getCurrentProject().id
                }).$promise.then(
                    function(instrumentNumbers) {
                      if (instrumentNumbers.length === 1) {
                        ctrl.instrument = new InstrumentResource({
                          id: InstrumentIdBuilderService.buildInstrumentId(
                            CurrentProjectService.getCurrentProject().id,
                            instrumentNumbers[0]
                          ),
                          number: instrumentNumbers[0],
                          dataAcquisitionProjectId:
                          CurrentProjectService.getCurrentProject().id,
                          studyId: StudyIdBuilderService.buildStudyId(
                            CurrentProjectService.getCurrentProject().id
                          ),
                        });
                        updateToolbarHeaderAndPageTitle();
                        $scope.registerConfirmOnDirtyHook();
                      } else {
                        $mdDialog.show({
                            controller: 'ChooseInstrumentNumberController',
                            templateUrl: 'scripts/instrumentmanagement/' +
                              'views/choose-instrument-number.html.tmpl',
                            clickOutsideToClose: false,
                            fullscreen: true,
                            locals: {
                              availableInstrumentNumbers: instrumentNumbers
                            }
                          })
                          .then(function(response) {
                            ctrl.instrument = new InstrumentResource({
                              id: InstrumentIdBuilderService.buildInstrumentId(
                                CurrentProjectService.getCurrentProject().id,
                                response.instrumentNumber
                              ),
                              number: response.instrumentNumber,
                              dataAcquisitionProjectId:
                              CurrentProjectService.getCurrentProject().id,
                              studyId: StudyIdBuilderService.buildStudyId(
                                CurrentProjectService.getCurrentProject().id
                              )
                            });
                            $scope.responseRateInitializing = true;
                            updateToolbarHeaderAndPageTitle();
                            $scope.registerConfirmOnDirtyHook();
                          });
                      }
                    });
              } else {
                handleReleasedProject();
              }
            }
          } else {
            SimpleMessageToastService.openAlertMessageToast(
              'global.edit.internet-explorer-not-supported');
          }
        } else {
          SimpleMessageToastService.openAlertMessageToast(
          'instrument-management.edit.not-authorized-toast');
        }
      };

      ctrl.saveInstrument = function() {
        if ($scope.instrumentForm.$valid) {
          ctrl.instrument.$save()
          .then(ctrl.updateElasticSearchIndex)
          .then(ctrl.onSavedSuccessfully)
          .catch(function(error) {
              console.log(error);
              SimpleMessageToastService.openAlertMessageToast(
                'instrument-management.edit.error-on-save-toast',
                {instrumentId: ctrl.instrument.id});
            });
        } else {
          // ensure that all validation errors are visible
          angular.forEach($scope.instrumentForm.$error, function(field) {
            angular.forEach(field, function(errorField) {
              errorField.$setTouched();
            });
          });
          SimpleMessageToastService.openAlertMessageToast(
            'instrument-management.edit.instrument-has-validation-errors-toast',
            null);
        }
      };

      ctrl.updateElasticSearchIndex = function() {
        return ElasticSearchAdminService.processUpdateQueue('instruments');
      };

      ctrl.onSavedSuccessfully = function() {
        $scope.instrumentForm.$setPristine();
        SimpleMessageToastService.openSimpleMessageToast(
          'instrument-management.edit.success-on-save-toast',
          {instrumentId: ctrl.instrument.id});
        if (ctrl.createMode) {
          $state.go('instrumentEdit', {id: ctrl.instrument.id});
        }
      };

      ctrl.openRestorePreviousVersionDialog = function(event) {
        $mdDialog.show({
            controller: 'ChoosePreviousInstrumentVersionController',
            templateUrl: 'scripts/instrumentmanagement/' +
              'views/choose-previous-instrument-version.html.tmpl',
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
              instrumentId: ctrl.instrument.id
            },
            targetEvent: event
          })
          .then(function(instrumentWrapper) {
            ctrl.instrument = new InstrumentResource(
              instrumentWrapper.instrument);
            ctrl.initSurveyChips();
            if (instrumentWrapper.isCurrentVersion) {
              $scope.instrumentForm.$setPristine();
              SimpleMessageToastService.openSimpleMessageToast(
                'instrument-management.edit.current-version-restored-toast',
                {
                  instrumentId: ctrl.instrument.id
                });
            } else {
              $scope.instrumentForm.$setDirty();
              SimpleMessageToastService.openSimpleMessageToast(
                'instrument-management.edit.previous-version-restored-toast',
                {
                  instrumentId: ctrl.instrument.id
                });
            }
          });
      };

      $scope.registerConfirmOnDirtyHook = function() {
        var unregisterTransitionHook = $transitions.onBefore({}, function() {
          if ($scope.instrumentForm.$dirty || ctrl.attachmentOrderIsDirty) {
            return CommonDialogsService.showConfirmOnDirtyDialog();
          }
        });

        $scope.$on('$destroy', unregisterTransitionHook);
      };

      ctrl.loadAttachments = function(selectLastAttachment) {
        InstrumentAttachmentResource.findByInstrumentId({
            instrumentId: ctrl.instrument.id
          }).$promise.then(
            function(attachments) {
              if (attachments.length > 0) {
                ctrl.attachments = attachments;
                if (selectLastAttachment) {
                  ctrl.currentAttachmentIndex = attachments.length - 1;
                }
              }
            });
      };

      ctrl.deleteAttachment = function(attachment, index) {
        CommonDialogsService.showConfirmFileDeletionDialog(attachment.fileName)
        .then(function() {
          attachment.$delete().then(function() {
            SimpleMessageToastService.openSimpleMessageToast(
              'instrument-management.detail.attachments.' +
                'attachment-deleted-toast',
              {filename: attachment.fileName}
            );
            ctrl.attachments.splice(index, 1);
            delete ctrl.currentAttachmentIndex;
          });
        });
      };

      ctrl.editAttachment = function(attachment, event) {
        $mdDialog.show({
            controller: 'InstrumentAttachmentEditOrCreateController',
            controllerAs: 'ctrl',
            templateUrl: 'scripts/instrumentmanagement/' +
              'views/instrument-attachment-edit-or-create.html.tmpl',
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
              instrumentAttachmentMetadata: attachment
            },
            targetEvent: event
          }).then(function() {
          ctrl.loadAttachments();
        });
      };

      ctrl.getNextIndexInInstrument = function() {
        if (!ctrl.attachments || ctrl.attachments.length === 0) {
          return 0;
        }
        return _.maxBy(ctrl.attachments, function(attachment) {
          return attachment.indexInInstrument;
        }).indexInInstrument + 1;
      };

      ctrl.addAttachment = function(event) {
        $mdDialog.show({
            controller: 'InstrumentAttachmentEditOrCreateController',
            controllerAs: 'ctrl',
            templateUrl: 'scripts/instrumentmanagement/' +
              'views/instrument-attachment-edit-or-create.html.tmpl',
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
              instrumentAttachmentMetadata: {
                indexInInstrument: ctrl.getNextIndexInInstrument(),
                instrumentId: ctrl.instrument.id,
                instrumentNumber: ctrl.instrument.number,
                dataAcquisitionProjectId:
                  ctrl.instrument.dataAcquisitionProjectId
              }
            },
            targetEvent: event
          }).then(function() {
          ctrl.loadAttachments(true);
        });
      };

      ctrl.moveAttachmentUp = function() {
        var a = ctrl.attachments[ctrl.currentAttachmentIndex - 1];
        ctrl.attachments[ctrl.currentAttachmentIndex - 1] =
          ctrl.attachments[ctrl.currentAttachmentIndex];
        ctrl.attachments[ctrl.currentAttachmentIndex] = a;
        ctrl.currentAttachmentIndex--;
        ctrl.attachmentOrderIsDirty = true;
      };

      ctrl.moveAttachmentDown = function() {
        var a = ctrl.attachments[ctrl.currentAttachmentIndex + 1];
        ctrl.attachments[ctrl.currentAttachmentIndex + 1] =
          ctrl.attachments[ctrl.currentAttachmentIndex];
        ctrl.attachments[ctrl.currentAttachmentIndex] = a;
        ctrl.currentAttachmentIndex++;
        ctrl.attachmentOrderIsDirty = true;
      };

      ctrl.saveAttachmentOrder = function() {
        var promises = [];
        ctrl.attachments.forEach(function(attachment, index) {
          attachment.indexInInstrument = index;
          promises.push(attachment.$save());
        });
        $q.all(promises).then(function() {
          SimpleMessageToastService.openSimpleMessageToast(
          'instrument-management.detail.attachments.' +
          'attachment-order-saved-toast',
          {});
          ctrl.attachmentOrderIsDirty = false;
        });
      };

      ctrl.selectAttachment = function(index) {
        if (Principal.hasAnyAuthority(['ROLE_PUBLISHER',
            'ROLE_DATA_PROVIDER'])) {
          ctrl.currentAttachmentIndex = index;
        }
      };

      ctrl.transformChip = function(chip) {
        return {
          id: chip._source.id,
          number: chip._source.number
        };
      };

      ctrl.updateSurveyReferences = function() {
        ctrl.instrument.surveyIds = [];
        ctrl.instrument.surveyNumbers = [];
        if (ctrl.surveyChips) {
          ctrl.surveyChips.forEach(function(chip) {
            ctrl.instrument.surveyIds.push(chip.id);
            ctrl.instrument.surveyNumbers.push(chip.number);
          });
        }
      };

      ctrl.searchSurveys = function(query) {
        return SearchDao.search(
          query, 1,
          ctrl.instrument.dataAcquisitionProjectId,
          null, 'surveys', 100,  ctrl.instrument.surveyIds
        ).then(function(result) {
            return result.hits.hits;
          });
      };

      ctrl.types = [
        'PAPI', 'CAPI', 'CATI', 'CAWI'
      ];

      init();
    });
