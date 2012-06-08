(function(angular) {
    var app = angular.module('puzzleApp', ['puzzle']);

    app.controller('puzzleCtrl', function($scope) {
        $scope.puzzles = [
            { id: 'angular', title: 'AngularJS', rows: 3, cols: 3 },
            { id: 'chrome', title: 'Google Chrome', rows: 3, cols: 3 },
            { id: 'firefox', title: 'Mozilla Firefox', rows: 3, cols: 3 },
            { id: 'ie', title: 'Internet Explorer', rows: 3, cols: 3 }
        ];
    });

})(angular);