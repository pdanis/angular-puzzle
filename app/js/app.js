(function(angular) {
    'use strict';

    var app = angular.module('puzzleApp', ['slidingPuzzle'/*, 'wordSearchPuzzle'*/]);

    // puzzle types
    var types = [
        { id: 'sliding-puzzle', title: 'Sliding puzzle' },
        { id: 'word-search-puzzle', title: 'Word search puzzle' }
    ];

    app.config(function($routeProvider) {
        $routeProvider.when('/:type');
    });

    app.run(function($rootScope, $route, $filter) {
        $rootScope.types = types;
        $rootScope.type = types[0].id;

        // set type on route change
        $rootScope.$on('$routeChangeSuccess', function(event, route) {
            $rootScope.type = ($filter('filter')(types, { id: route.params.type }).length ? route.params.type : types[0].id);
        });
    });

    app.controller('slidingAdvancedCtrl', function($scope) {
        $scope.puzzles = [
            { src: './img/misko.jpg', title: 'Miško Hevery', rows: 4, cols: 4 },
            { src: './img/igor.jpg', title: 'Igor Minár', rows: 3, cols: 3 },
            { src: './img/vojta.jpg', title: 'Vojta Jína', rows: 4, cols: 3 }
        ];
    });

})(window.angular);