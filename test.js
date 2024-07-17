// app.js
var app = angular.module('paginationApp', []);

app.controller('PaginationController', function($scope) {
    // Sample data
    $scope.items = [];
    for (var i = 1; i <= 100; i++) {
        $scope.items.push('Item ' + i);
    }

    $scope.currentPage = 0;
    $scope.itemsPerPage = 10;
    $scope.totalPages = Math.ceil($scope.items.length / $scope.itemsPerPage);

    $scope.range = function(n) {
        return new Array(n);
    };

    $scope.setPage = function(page) {
        $scope.currentPage = page;
        $scope.updateFilteredItems();
    };

    $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            $scope.updateFilteredItems();
        }
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalPages - 1) {
            $scope.currentPage++;
            $scope.updateFilteredItems();
        }
    };

    $scope.updateFilteredItems = function() {
        var start = $scope.currentPage * $scope.itemsPerPage;
        var end = start + $scope.itemsPerPage;
        $scope.filteredItems = $scope.items.slice(start, end);
    };

    // Initialize the filtered items
    $scope.updateFilteredItems();
});
