describe('Sliding puzzle', function() {
    var puzzle,
        rows = 2,
        cols = 3;

    function fireEvent(element, event) {
        var evt;
        if (document.createEvent) {
            evt = document.createEvent('HTMLEvents');
            evt.initEvent(event, true, true);
            return !element.dispatchEvent(evt);
        } else {
            evt = document.createEventObject();
            return element.fireEvent('on' + event, evt);
        }
    }

    function click(element) {
        fireEvent(element, 'click');
    }

    beforeEach(module('slidingPuzzle'));

    /**
     * Controller tests
     */
    describe('puzzle object', function() {
        beforeEach(inject(function(slidingPuzzle) {
            puzzle = slidingPuzzle(rows, cols);
        }));

        function tile(row, col) {
            return puzzle.grid[row][col];
        }

        it('should initialize puzzle grid by size', function() {
            expect(puzzle.grid).toBeDefined();
            expect(puzzle.grid.length).toBe(rows);
            expect(puzzle.grid[0].length).toBe(cols);
        });

        it('should have empty flag on last item', function() {
            expect(tile(rows - 1, cols - 1).empty).toBe(true);
            expect(tile(0, 0).empty).toBe(false);
        });

        it('should move movable item', function() {
            var x = rows - 1,
                y = cols - 2,
                item = tile(x, y);

            puzzle.move(x, y);
            expect(tile(x, y)).not.toBe(item);
            expect(tile(x, y + 1)).toBe(item);
            expect(tile(x, y).empty).toBe(true);
        });

        it('should not move non-movable first item', function() {
            var x = 0,
                y = 0,
                item = tile(x, y);

            puzzle.move(x, y);
            expect(tile(x, y)).toBe(item);
        });

        it('should return correct "solved" status', function() {
            var x = rows - 1,
                y = cols - 2,
                item = tile(x, y);

            expect(puzzle.isSolved()).toBe(true);
            puzzle.move(x, y);
            expect(puzzle.isSolved()).toBe(false);
            puzzle.move(x, y + 1);
            expect(puzzle.isSolved()).toBe(true);
        });

        it('should solve puzzle when "solve" called', function() {
            var x = rows - 1,
                y = cols - 2,
                item = tile(x, y);

            expect(puzzle.isSolved()).toBe(true);
            puzzle.move(x, y);
            expect(puzzle.isSolved()).toBe(false);
            puzzle.solve();
            expect(puzzle.isSolved()).toBe(true);
        });

    });

    /**
     * Directive tests
     * @todo image mock, background positioning test
     */
    describe('puzzle directive', function() {
        var scope, template, templateScope,
            size = rows + 'x' + cols;

        function tile(row, col) {
            return template.find('tr').eq(row).find('td').eq(col);
        }

        beforeEach(function() {
            inject(function($compile, $rootScope) {
                scope = $rootScope.$new();
                scope.size = size;
                template = $compile('<sliding-puzzle api="api" size="{{size}}" src="img/angular.png"></sliding-puzzle>')(scope);
                templateScope = template.scope();
                scope.$apply();
            });
        });

        it('should initialize puzzle object in directive scope (only)', function() {
            expect(templateScope.puzzle).toBeDefined();
            expect(scope.puzzle).toBeUndefined();
        });

        it('should assign the puzzle object into parent scope by "api" accessor', function() {
            expect(typeof(scope.api)).toBe('object');
            expect(scope.api.grid).toBeDefined();
            expect(scope.api.grid.length).toBe(2);
            expect(scope.api.grid[0].length).toBe(3);
        });

        it('should initialize size in directive scope', function() {
            expect(templateScope.size).toBe(size);
        });

        it('should create 2x3 table', function() {
            expect(template.find('tr').length).toBe(2);
            expect(template.find('td').length).toBe(6);
        });

        it('should have puzzle-solved class on init', function() {
            expect(template.hasClass('puzzle-solved')).toBe(true);
        });

        it('should have puzzle-empty class on last element', function() {
            expect(tile(rows - 1, cols - 1).hasClass('puzzle-empty')).toBe(true);
        });

        it('should regenerate puzzle when size changed', function() {
            scope.size = '4x4';
            scope.$apply();
            expect(template.find('tr').length).toBe(4);
            expect(template.find('td').length).toBe(16);
        });

        it('should "move" movable tile on click', function() {
            var x = rows - 1,
                y = cols - 2,
                node = tile(x, y)[0];

            expect(node.title).toBe('5');
            click(node);
            expect(tile(x, y)[0]).not.toBe('5');
            expect(tile(x, y + 1)[0].title).toBe('5');
            expect(tile(x, y).hasClass('puzzle-empty')).toBe(true);
        });

        it('should not "move" non-movable first tile on click', function() {
            var node = tile(0, 0)[0];
            expect(node.title).toBe('1');
            click(node);
            expect(tile(0, 0)[0].title).toBe('1');
        });

    });

});