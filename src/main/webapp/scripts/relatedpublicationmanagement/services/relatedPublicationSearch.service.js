/* global _ */
'use strict';

angular.module('metadatamanagementApp')
  .factory('RelatedPublicationSearchService',
    function(ElasticSearchClient, $q, CleanJSObjectService,
      SearchHelperService) {
      var createQueryObject = function(type) {
        type = type || 'related_publications';
        return {
          index: type,
          type: type
        };
      };

      var createTermFilters = function(filter, dataAcquisitionProjectId, type) {
        type = type || 'related_publications';
        var termFilter;
        if (!CleanJSObjectService.isNullOrEmpty(filter) ||
          !CleanJSObjectService.isNullOrEmpty(dataAcquisitionProjectId)) {
          termFilter = [];
        }
        if (!CleanJSObjectService.isNullOrEmpty(dataAcquisitionProjectId)) {
          var projectFilter = {
            term: {
              dataAcquisitionProjectId: dataAcquisitionProjectId
            }
          };
          termFilter.push(projectFilter);
        }
        if (!CleanJSObjectService.isNullOrEmpty(filter)) {
          termFilter = _.concat(termFilter,
            SearchHelperService.createTermFilters(type, filter));
        }
        return termFilter;
      };

      var findOneById = function(id) {
        var deferred = $q.defer();
        var query = createQueryObject();
        query.id = id;
        ElasticSearchClient.getSource(query, function(error, response) {
            if (error) {
              deferred.reject(error);
            } else {
              deferred.resolve(response);
            }
          });
        return deferred;
      };
      var findBySurveyId = function(surveyId, selectedAttributes, from,
        size) {
        var query = createQueryObject();
        query.body = {};
        query.body.from = from;
        query.body.size = size;
        query.body._source = selectedAttributes;
        query.body._source = selectedAttributes;
        query.body.query = {
          'bool': {
            'must': [{
              'match_all': {}
            }],
            'filter': [{
              'term': {
                'surveyIds': surveyId
              }
            }]
          }
        };
        return ElasticSearchClient.search(query);
      };
      var findByQuestionId = function(questionId, selectedAttributes, from,
        size) {
        var query = createQueryObject();
        query.body = {};
        query.body.from = from;
        query.body.size = size;
        query.body._source = selectedAttributes;
        query.body.query = {
          'bool': {
            'must': [{
              'match_all': {}
            }],
            'filter': [{
              'term': {
                'questionIds': questionId
              }
            }]
          }
        };
        return ElasticSearchClient.search(query);
      };
      var findByVariableId = function(variableId, selectedAttributes, from,
        size) {
        var query = createQueryObject();
        query.body = {};
        query.body.from = from;
        query.body.size = size;
        query.body._source = selectedAttributes;
        query.body.query = {
          'bool': {
            'must': [{
              'match_all': {}
            }],
            'filter': [{
              'term': {
                'variables.id': variableId
              }
            }]
          }
        };
        return ElasticSearchClient.search(query);
      };
      var findByInstrumentId = function(instrumentId, selectedAttributes,
        from, size) {
        var query = createQueryObject();
        query.body = {};
        query.body.from = from;
        query.body.size = size;
        query.body._source = selectedAttributes;
        query.body.query = {
          'bool': {
            'must': [{
              'match_all': {}
            }],
            'filter': [{
              'term': {
                'instrumentIds': instrumentId
              }
            }]
          }
        };
        return ElasticSearchClient.search(query);
      };
      var findByDataSetId = function(dataSetId, selectedAttributes, from,
        size) {
        var query = createQueryObject();
        query.body = {};
        query.body.from = from;
        query.body.size = size;
        query.body._source = selectedAttributes;
        query.body.query = {
          'bool': {
            'must': [{
              'match_all': {}
            }],
            'filter': [{
              'term': {
                'dataSetIds': dataSetId
              }
            }]
          }
        };
        return ElasticSearchClient.search(query);
      };
      var findByStudyId = function(studyId, selectedAttributes, from,
        size) {
        var query = createQueryObject();
        query.body = {};
        query.body.from = from;
        query.body.size = size;
        query.body._source = selectedAttributes;
        query.body.query = {
          'bool': {
            'must': [{
              'match_all': {}
            }],
            'filter': [{
              'term': {
                'studyIds': studyId
              }
            }]
          }
        };
        return ElasticSearchClient.search(query);
      };
      var countBy = function(term, value) {
        var query = createQueryObject();
        query.body = {};
        query.body.query = {};
        query.body.query = {
          'bool': {
            'must': [{
              'match_all': {}
            }],
            'filter': []
          }
        };
        var mustTerm = {
          'term': {}
        };
        mustTerm.term[term] = value;
        query.body.query.bool.filter.push(mustTerm);
        return ElasticSearchClient.count(query);
      };

      var findTitles = function(searchText, filter, type,
        queryterm, dataAcquisitionProjectId) {
        var query = createQueryObject(type);
        query.size = 0;
        query.body = {};
        var termFilters = createTermFilters(filter, dataAcquisitionProjectId,
          type);
        var prefix = (type === 'related_publications' || !type)  ? ''
          : 'nestedRelatedPublications.';
        var aggregation = {
            'aggs': {
              'title': {
                'filter': {
                  'bool': {
                    'must': [{
                      'match': {

                      }
                    }]
                  }
                },
                'aggs': {
                  'id': {
                    'terms': {
                      'field': prefix + 'id',
                      'size': 100
                    },
                    'aggs': {
                      'title': {
                        'terms': {
                          'field': prefix + 'title',
                          'size': 100
                        },
                        'aggs': {
                          'language': {
                            'terms': {
                              'field': prefix + 'language',
                              'size': 100
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          };
        var nestedAggregation = {
          'aggs': {
              'relatedPublications': {
                'nested': {
                  'path': 'nestedRelatedPublications'
                }
              }
            }
        };

        aggregation.aggs.title.filter.bool.must[0]
        .match[prefix + 'completeTitle.de'] =  {
          'query': searchText,
          'operator': 'AND',
          'minimum_should_match': '100%',
          'zero_terms_query': 'ALL'
        };

        if (prefix !== '') {
          nestedAggregation.aggs.relatedPublications.aggs =
            aggregation.aggs;
          query.body.aggs = nestedAggregation.aggs;
        } else {
          query.body.aggs = aggregation.aggs;
        }

        if (termFilters) {
          query.body.query = query.body.query || {};
          query.body.query.bool = query.body.query.bool || {};
          query.body.query.bool.filter = termFilters;
        }

        SearchHelperService.addQuery(query, queryterm);

        SearchHelperService.addReleaseFilter(query);

        return ElasticSearchClient.search(query).then(function(result) {
          var titles = [];
          var titleElement = {};
          var buckets = [];
          if (prefix !== '') {
            buckets = result.aggregations.relatedPublications.title.id.buckets;
          } else {
            buckets = result.aggregations.title.id.buckets;
          }
          buckets.forEach(function(bucket) {
              titleElement = {
                title: bucket.title.buckets[0].key,
                language: bucket.title.buckets[0].language.buckets[0].key,
                id: bucket.key,
                count: bucket.doc_count
              };
              titles.push(titleElement);
            });
          return titles;
        });
      };

      return {
        findOneById: findOneById,
        findBySurveyId: findBySurveyId,
        findByVariableId: findByVariableId,
        findByDataSetId: findByDataSetId,
        findByQuestionId: findByQuestionId,
        findByStudyId: findByStudyId,
        findByInstrumentId: findByInstrumentId,
        countBy: countBy,
        findTitles: findTitles
      };
    });
