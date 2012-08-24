(function(angular) {
    'use strict';

    var module = angular.module('wordSearchPuzzle', []);

    /**
     * Service
     */
    module.factory('wordSearchPuzzle', function() {
        /**
         * Word search puzzle
         * @param matrix
         * @param words
         * @constructor
         */
        function WordSearchPuzzle(matrix, words) {
            var maxRow = 0,
                maxCol = 0;

            /**
             * Matrix
             * @type {Array}
             */
            this.matrix = [];

            /**
             * Words
             * @type {Array}
             */
            this.words = [];

            /**
             * Is solved?
             * @type {Boolean}
             */
            this.solved = false;

            // parse matrix and words
            angular.forEach(matrix, function(letters, row) {
                angular.forEach(letters, function(letter, col) {
                    var item = {
                        letter: letter,
                        col: col,
                        row: row,
                        used: false
                    };
                    if (!this.matrix[row]) {
                        this.matrix[row] = [];
                    }
                    this.matrix[row].push(item);
                    maxCol = col;
                }, this);
                maxRow = row;
            }, this);
            angular.forEach(words, function(word) {
                this.words.push({
                    name: word
                });
            }, this);

            /**
             * Returns matrix item by coords
             * @param col
             * @param row
             * @return {*}
             */
            this.getItem = function(col, row) {
                return (this.matrix[row] ? this.matrix[row][col] : undefined);
            };

            /**
             * Returns matrix items by start/end coords
             * @param colFrom
             * @param rowFrom
             * @param colTo
             * @param rowTo
             * @return {Array}
             */
            this.getItems = function(colFrom, rowFrom, colTo, rowTo) {
                var items = [];

                if (rowTo > maxRow) {
                    rowTo = maxRow;
                }
                if (colTo > maxCol) {
                    colTo = maxCol;
                }

                if (this.getItem(colTo, rowTo) === undefined) {
                    return items;
                }

                if (colFrom === colTo || rowFrom === rowTo || Math.abs(colTo - colFrom) === Math.abs(rowTo - rowFrom)) {
                    var shiftX = (colFrom === colTo ? 0 : (colTo > colFrom ? 1 : -1)),
                        shiftY = (rowFrom === rowTo ? 0 : (rowTo > rowFrom ? 1 : -1)),
                        col = colFrom,
                        row = rowFrom;

                    items.push(this.getItem(col, row));
                    do {
                        col += shiftX;
                        row += shiftY;
                        items.push(this.getItem(col, row));
                    } while (col !== colTo || row !== rowTo);
                }

                return items;
            };

            /**
             * Check items - find word
             * @param items
             */
            this.lookup = function(items) {
                if (!items.length) {
                    return;
                }

                // create words
                var words = [''];
                angular.forEach(items, function(item) {
                    words[0] += item.letter;
                });
                words.push(words[0].split('').reverse().join(''));	// word in reverse order (when selecting)

                // check words
                this.solved = true;
                angular.forEach(this.words, function(word) {
                    if (word.found) {
                        return;
                    }
                    angular.forEach(words, function(itemWord) {
                        if (word.name === itemWord) {
                            word.found = true;
                            angular.forEach(items, function(item) {
                                item.found = true;
                            });
                        }
                    });
                    if (!word.found) {
                        this.solved = false;
                    }
                }, this);
            };

            /**
             * Solves puzzle
             */
            this.solve = function() {
                var start = {},
                    directions = {
                        N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0],
                        NE: [1, -1], NW: [-1, -1], SE: [1, 1], SW: [-1, 1]
                    };

                // group items by letters for faster search
                angular.forEach(this.matrix, function(items) {
                    angular.forEach(items, function(item) {
                        if (!start[item.letter]) {
                            start[item.letter] = [];
                        }
                        start[item.letter].push(item);
                    });
                });

                angular.forEach(this.words, function(word) {
                    angular.forEach(start[word.name.charAt(0)], function(start) {
                        if (word.found) {
                            return;
                        }
                        angular.forEach(directions, function(shift) {
                            if (word.found) {
                                return;
                            }
                            this.lookup(this.getItems(
                                start.col, start.row,
                                start.col + (word.name.length - 1) * shift[0],
                                start.row + (word.name.length - 1) * shift[1]
                            ));
                        }, this);
                    }, this);
                }, this);
            };
        }

        return function(matrix, words) {
            return new WordSearchPuzzle(matrix, words);
        };
    });

    /**
     * Directive
     */
    module.directive('wordSearchPuzzle', function(wordSearchPuzzle) {
        return {
            restrict: 'EA',
            replace: true,
            template: '<table class="word-search-puzzle" cellspacing="0" ng-class="{\'puzzle-solved\': puzzle.solved}">' +
                '<tr ng-repeat="items in puzzle.matrix">' +
                '<td ng-repeat="item in items" unselectable="on"' +
                ' ng-class="{\'puzzle-found\': item.found, \'puzzle-selected\': item.selected, \'puzzle-message\': puzzle.solved && !item.found}"' +
                ' ng-mousedown="selectStart(item)" ng-mouseup="selectEnd()" ng-mouseenter="selectEnter(item)">' +
                ' <span>{{item.letter}}</span>' +
                '</td>' +
                '</tr>' +
                '</table>',
            scope: {
                matrix: '=',
                words: '=',
                api: '='
            },
            link: function(scope, element, attrs) {
                var selectFrom;

                // setup puzzle
                scope.$watch('matrix', function(matrix) {
                    scope.puzzle = wordSearchPuzzle(matrix, scope.words);

                    // link service
                    if (attrs.api) {
                        scope.api = scope.puzzle;
                    }
                });

                /**
                 * Selected items
                 * @type {Array}
                 */
                scope.selected = [];

                /**
                 * Selection start
                 * @param item
                 */
                scope.selectStart = function(item) {
                    selectFrom = item;
                };

                /**
                 * Selection enter (over)
                 * @param item
                 */
                scope.selectEnter = function(item) {
                    if (selectFrom) {
                        scope.selected = scope.puzzle.getItems(selectFrom.col, selectFrom.row, item.col, item.row);
                    }
                };

                /**
                 * Selection end
                 */
                scope.selectEnd = function() {
                    selectFrom = null;
                    scope.puzzle.lookup(scope.selected);
                    scope.selected = [];
                };

                // propagate selection state to matrix
                scope.$watch('selected', function(newItems, oldItems) {
                    angular.forEach(oldItems, function(item) {
                        item.selected = false;
                    });
                    angular.forEach(newItems, function(item) {
                        item.selected = true;
                    });
                });
            }
        };
    });
})(window.angular);
