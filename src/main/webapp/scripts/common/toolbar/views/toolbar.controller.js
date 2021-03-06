'use strict';

angular.module('metadatamanagementApp').controller(
  'ToolbarController',
  function($scope, $mdSidenav, $location, ShoppingCartService, Principal) {
    //Toggle Function
    $scope.toggleLeft = function() {
      $mdSidenav('SideNavBar').toggle();
    };

    $scope.isAuthenticated = Principal.isAuthenticated;
    $scope.hasAuthority = Principal.hasAuthority;

    $scope.productsCount = ShoppingCartService.count();
    $scope.$on('shopping-cart-changed',
      function(event, count) { // jshint ignore:line
        $scope.productsCount = count;
      });

    $scope.$location = $location;
  });
