(function(angular) {
    var app = angular.module('puzzleApp', ['puzzle']);

    app.controller('puzzleCtrl', function($scope) {
        $scope.puzzles = [
            { src: './img/misko.jpg', title: 'Miško Hevery', rows: 4, cols: 4 },
            { src: './img/igor.jpg', title: 'Igor Minár', rows: 3, cols: 3 },
            { src: './img/vojta.jpg', title: 'Vojta Jína', rows: 4, cols: 3 }
        ];
    });

})(angular);