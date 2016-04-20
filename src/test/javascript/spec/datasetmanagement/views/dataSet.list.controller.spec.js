/* global describe */
/* global beforeEach */
/* global it */
/* global inject */
/* global expect */
/* global spyOn */

'use strict';

describe('DataSetListController', function() {
  var $scope;
  var $rootScope;
  var DataSetsCollection;
  var createController;
  var params;
  var result;

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    result = {
      page: {
        totalElements: 10
      }
    };
    params = {
      dataAcquisitionProjectId: 'rdcId'
    };
    $scope.params = params;
    $scope.init = function() {

    };
    DataSetsCollection = {
      query: function(param, callback) {
        callback(result);
      }
    };
    var locals = {
      '$scope': $scope,
      'DataSetsCollection': DataSetsCollection
    };
    createController = function() {
      $injector.get('$controller')('DataSetListController',
        locals);
    };
    spyOn(DataSetsCollection, 'query').and.callThrough();
  }));

  it('should set $scope.pageState.totalElements', function() {
    createController();
    expect($scope.pageState.totalElements).toEqual(10);
  });
  it('should DataSetsCollection.query after broadcast', function() {
    createController();
    $rootScope.$broadcast('dataSets-uploaded');
    expect(DataSetsCollection.query).toHaveBeenCalled();
  });
});