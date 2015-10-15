var assert = require('chai').assert;
var di = require('../../src');

suite('injector.getDependencies', function() {

    var injector;

    setup(function () {
        injector = di.injector();
    });

    test('get dependencies from $inject should return $inject array', function () {
        function foo(x, y, z) {
        }

        foo.$inject = ['a', 'b', 'c'];

        assert.deepEqual(injector.getDependencies(foo), ['a', 'b', 'c']);
    });

    test('get dependencies if no $inject attribute should return get dependencies from func arguments', function () {
        function foo(x, y, z) {
        }

        assert.deepEqual(injector.getDependencies(foo), ['x', 'y', 'z']);
    });

    test('get dependencies from array', function() {
        function foo(x, y) {
            return (x + y);
        }

        assert.deepEqual(injector.getDependencies(['bar', 'baz', foo]), ['bar', 'baz']);
    });

});
