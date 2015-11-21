var assert = require('chai').assert;
var di = require('../../src');

suite('injector.invoke', function () {
    var container;
    var injector;

    function Service() {
    }

    setup(function () {
        container = di.container()
            .value('myValue', 123)
            .factory('myValue2', function () {
                return 'abc';
            })
            .service('myService', Service)
        ;

        injector = di.injector(container);
    });

    test('invoke should call the function and inject dependencies', function () {
        foo.$inject = ['myValue', 'myValue2', 'myService'];
        function foo(x, y, z) {
            return [x, y, z];
        }

        assert.deepEqual(injector.invoke(foo), [123, 'abc', new Service()]);
    });

    test('invoke with array', function () {
        function foo(x, y) {
            return [x, y];
        }

        container
            .value('bar', 123)
            .value('baz', 'abc');

        assert.deepEqual(injector.invoke(['bar', 'baz', foo]), [123, 'abc']);
    });

    test('it should throw error if called with non-function', function() {
        assert.throws(function() { injector.invoke({}) }, /fn expected to be a function --or-- array with last item function/);
    });

    test('it should throw error if called with non-function', function() {
        assert.throws(function() { injector.invoke(['a', 'b', {}]) }, /fn expected to be a function --or-- array with last item function/);
    });
});
