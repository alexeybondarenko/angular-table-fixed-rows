'use strict';

angular.module('app', [
  'table-fixed-rows',
  'dragcolumns'
]);

angular.module('app').controller('AppController', function ($scope, $http, $timeout) {

  $http.get('https://data.ct.gov/resource/y6p2-px98.json?category=Fruit&item=Peaches').then(function (resp) {
    $scope.table.data = resp.data;
    $scope.$broadcast('table-fixed-rows:refresh');
  });
  $scope.table = {
    headers: [
      {"key": "business"},
      {"key": "category"},
      {"key": "farmer_id"},
      {"key": "item"},
      {"key": "l"},
      {"key": "location_1"},
      {"key": "location_1_city"},
      {"key": "location_1_location"},
      {"key": "location_1_state"},
      {"key": "zipcode"}
    ],
    data: []
  };

  //$scope.onReorder = function () {
  //  $timeout(function () {
  //    $scope.$broadcast('table-fixed-rows:refresh');
  //  }, 100);
  //};

  $scope.$on('dragcolumnsStopDragging', function () {
    $scope.$broadcast('table-fixed-rows:refresh');
  });

  //$scope.$on('filter.header', function () {
    //$scope.$broadcast('table-fixed-rows:refresh');
  //});

});
