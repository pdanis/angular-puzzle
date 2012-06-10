(function(angular) {
    var app = angular.module('puzzleApp', ['puzzle']);

    app.controller('puzzleCtrl', function($scope) {
        $scope.puzzles = [
            { src: './img/angular.png', title: 'AngularJS', rows: 3, cols: 3 },
            { src: './img/chrome.png', title: 'Google Chrome', rows: 4, cols: 4 },
            { src: './img/firefox.png', title: 'Mozilla Firefox', rows: 5, cols: 5 },
            { src: './img/ie.png', title: 'Internet Explorer', rows: 3, cols: 4 }
        ];
    });

})(angular);