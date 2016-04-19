/* global XLSX*/
'use strict';

angular.module('metadatamanagementApp').service('VariableBuilderService',
function(Variable, CleanJSObjectService, JobLoggingService) {
  var getVariables = function(data, dataAcquisitionProjectId) {
    var jsonContent = {};
    var variablesObjArray = [];
    try {
      var excelFile = data.files['variables.xlsx'];
      var content = XLSX.read(excelFile.asBinary(), {type: 'binary'});
      var sheetList = content.SheetNames;
      var worksheet = content.Sheets[sheetList[0]];
      // jscs:disable
      jsonContent = XLSX.utils.sheet_to_json(worksheet);
      // jscs:enable
      for (var i = 0; i < jsonContent.length; i++) {
        var variableObj = {
        id: jsonContent[i].id,
        atomicQuestionId: jsonContent[i].atomicQuestionId,
        accessWays: CleanJSObjectService.
        removeWhiteSpace(jsonContent[i].accessWays),
        dataAcquisitionProjectId: dataAcquisitionProjectId,
        dataType: {
          en: jsonContent[i]['dataType.en'],
          de: jsonContent[i]['dataType.de']
        },
        label: {
          en: jsonContent[i]['label.en'],
          de: jsonContent[i]['label.de']
        },
        description: {
          en: jsonContent[i]['description.en'],
          de: jsonContent[i]['description.de']
        },
        filterDetails: {
          expression:
          jsonContent[i]['filterDetails.expression'],
          description: {
            en: jsonContent[i]['filterDetails.description.de'],
            de: jsonContent[i]['filterDetails.description.en']
          },
          filterExpressionLanguage:
          jsonContent[i]['filterDetails.filterExpressionLanguage']
        },
        generationDetails: {
          rule: jsonContent[i]['generationDetails.rule'],
          ruleExpressionLanguage: jsonContent[i]
          ['generationDetails.ruleExpressionLanguage'],
          description: {
            en: jsonContent[i]['generationDetails.description.en'],
            de: jsonContent[i]['generationDetails.description.de']
          }
        },
        sameVariablesInPanel: CleanJSObjectService.
        removeWhiteSpace(jsonContent[i].sameVariablesInPanel),
        name: jsonContent[i].name,
        scaleLevel: {
          en: jsonContent[i]['scaleLevel.en'],
          de: jsonContent[i]['scaleLevel.de']
        },
        statistics: {
          firstQuartile: jsonContent[i]['statistics.firstQuartile'],
          highWhisker: jsonContent[i]['statistics.highWhisker'],
          kurtosis: jsonContent[i]['statistics.kurtosis'],
          lowWhisker: jsonContent[i]['statistics.lowWhisker'],
          maximum: jsonContent[i]['statistics.maximum'],
          meanValue: jsonContent[i]['statistics.meanValue'],
          median: jsonContent[i]['statistics.median'],
          minimum: jsonContent[i]['statistics.minimum'],
          skewness: jsonContent[i]['statistics.skewness'],
          standardDeviation: jsonContent[i]
          ['statistics.standardDeviation'],
          thirdQuartile: jsonContent[i]['statistics.thirdQuartile']
        },
        values: data.files['values/' + jsonContent[i].id + '.json'] ?
          JSON.parse(data.files['values/' + jsonContent[i].id + '.json']
          .asBinary()).values : undefined,
        surveyIds: CleanJSObjectService.
        removeWhiteSpace(jsonContent[i].surveyIds),
        conceptId: jsonContent[i].conceptId,
        dataSetIds: CleanJSObjectService.
        removeWhiteSpace(jsonContent[i].dataSetIds),
        valueSummary: {
          totalAbsoluteFrequency:
          jsonContent[i]['valueSummary.totalAbsoluteFrequency'],
          totalValidAbsoluteFrequency:
          jsonContent[i]['valueSummary.totalValidAbsoluteFrequency'],
          totalValidRelativeFrequency:
          jsonContent[i]['valueSummary.totalValidRelativeFrequency']
        }
      };
        CleanJSObjectService.removeEmptyJsonObjects(variableObj);
        variablesObjArray.push(new Variable(variableObj));
      }
    }catch (e) {
      console.log(e);
      JobLoggingService.cancel('' + e, {});
    }
    return variablesObjArray;
  };
  return {
      getVariables: getVariables
    };
});
