(function(angular) {

    var module = angular.module('puzzle', []);

    module.factory('Puzzle', function() {
        function shuffle(a) {
            for (var j, x, i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x) {}
            return a;
        }

        function Puzzle(rows, cols) {
            /**
             * Puzzle grid
             * @type {Array}
             */
            this.grid = [];

            /**
             * Moves count
             * @type {Number}
             */
            this.moves = 0;

            /**
             * Moves tile
             * @param srow
             * @param scol
             */
            this.move = function(srow, scol) {
                var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]],
                    tref, trow, tcol;

                for (var d = 0; d < dirs.length; d++) {
                    trow = srow + dirs[d][0];
                    tcol = scol + dirs[d][1];
                    if (this.grid[trow] && this.grid[trow][tcol] && this.grid[trow][tcol].empty) {
                        tref = this.grid[srow][scol];
                        this.grid[srow][scol] = this.grid[trow][tcol];
                        this.grid[trow][tcol] = tref;
                        this.moves++;
                    }
                }
            };

            /**
             * Shuffles grid
             */
            this.shuffle = function() {
                var tiles = [];
                this.traverse(function(tile) {
                    tiles.push(tile);
                });
                shuffle(tiles);
                this.traverse(function(tile, row, col) {
                    this.grid[row][col] = tiles.shift();
                });
                this.moves = 0;
            };

            /**
             * Solves puzzle
             */
            this.solve = function() {
                var tiles = [];
                this.traverse(function(tile) {
                    tiles.push(tile);
                });
                tiles.sort(function(x, y) {
                    return (x.id - y.id);
                });
                this.traverse(function(tile, row, col) {
                    this.grid[row][col] = tiles.shift();
                });
            };

            /**
             * Is solved?
             * @type {Boolean}
             */
            this.isSolved = function() {
                var id = 1;
                for (var row = 0; row < rows; row++) {
                    for (var col = 0; col < cols; col++) {
                        if (this.grid[row][col].id != id++) {
                            return false;
                        }
                    }
                }
                return true;
            }

            /**
             * Traverses grid and executes fn on every tile
             * @param fn
             */
            this.traverse = function(fn) {
                for (var row = 0; row < rows; row++) {
                    for (var col = 0; col < cols; col++) {
                        fn.call(this, this.grid && this.grid[row] ? this.grid[row][col] : undefined, row, col);
                    }
                }
            };

            // initialize grid
            var id = 1;
            this.traverse(function(tile, row, col) {
                this.grid[row] || (this.grid[row] = []);
                this.grid[row][col] = {
                    id: id++,
                    empty: (row == rows - 1) && (col == cols - 1)
                };
                if (this.grid[row][col].empty) {
                    this.empty = this.grid[row][col];
                }
            });
        }

        return function(rows, cols) {
            return new Puzzle(rows, cols);
        }
    });

    module.directive('puzzle', function(Puzzle) {
        return {
            restrict: 'E',
            replace: true,
            template: '<table>' +
                '<tr ng-repeat="($row, row) in puzzle.grid">' +
                '<td ng-repeat="($col, tile) in row" ng-click="puzzle.move($row, $col)" ng-style="tile.style" ng-class="{empty: tile.empty}" title="{{tile.id}}"></td>' +
                '</tr>' +
                '</table>',
            scope: {
                size: 'bind',
                src: 'bind',
                model: 'accessor'
            },
            link: function(scope) {
                var puzzle,
                    image = new Image();

                scope.$watch('size', function(size) {
                    size = size.split('x');
                    if (size[0] >= 2 && size[1] >= 2) {
                        create(size[0], size[1]);
                    }
                });

                function create(rows, cols) {
                    puzzle = scope.puzzle = Puzzle(rows, cols);
                    scope.model(puzzle);

                    function setup() {
                        var width = image.width / cols,
                            height = image.height / rows;

                        puzzle.traverse(function(tile, row, col) {
                            tile.style = {
                                width: width + 'px',
                                height: height + 'px',
                                background: (tile.empty ? 'none' : "url('" + scope.src + "') no-repeat -" + (col * height) + 'px -' + (row * width) + 'px')
                            }
                        });

                        puzzle.shuffle();
                    }

                    image.src = scope.src;
                    if (image.complete) {
                        setup();
                    } else {
                        image.onload = function() {
                            scope.$apply(setup);
                        }
                    }
                }
            }
        }
    });
})(angular);
