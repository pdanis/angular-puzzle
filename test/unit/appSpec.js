describe('App', function() {

    beforeEach(module('puzzleApp'));

    describe('advancedCtrl', function() {
        var ctrl, scope;

        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('slidingAdvancedCtrl', {
                $scope: scope
            });
        }));

        it('should publish the puzzles model', function() {
            expect(scope.puzzles).toBeDefined();
        });

        it('should have correct size set in model', function() {
            scope.puzzles.forEach(function(item) {
                expect(item.rows).toBeGreaterThan(0);
                expect(item.cols).toBeGreaterThan(0);
            });
        });
    });

});
