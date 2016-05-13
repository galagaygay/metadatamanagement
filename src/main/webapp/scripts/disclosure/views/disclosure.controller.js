'use strict';

angular.module('metadatamanagementApp').controller('DisclosureController',
    function($scope, Principal) {
      Principal.identity().then(function(account) {
        $scope.account = account;
        $scope.isAuthenticated = Principal.isAuthenticated;
      });
    });