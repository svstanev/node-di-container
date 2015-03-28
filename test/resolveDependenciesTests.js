var assert = require('chai').assert;
var Container = require('../src/container').Container;

suite('resolve dependencies tests', function () {
    var container;

    setup(function () {
        container = new Container();
    });

    test('get dependencies from $inject should return $inject array', function () {
        function foo(x, y, z) {
        }

        foo.$inject = ['a', 'b', 'c'];

        assert.deepEqual(container.getDependencies(foo), ['a', 'b', 'c']);
    });

    test('get dependencies if no $inject attribute should return get dependencies from func arguments', function () {
        function foo(x, y, z) {
        }

        assert.deepEqual(container.getDependencies(foo), ['x', 'y', 'z']);
    });

    test('get dependencies from array', function() {
       function foo(x, y) {
           return (x + y);
       }

        container
            .value('bar', 123)
            .value('baz', 'abc');

        assert.deepEqual(container.getDependencies(['bar', 'baz', foo]), ['bar', 'baz']);
    });

    test('resolve from $inject attribute', function () {

        function Service() {

        }

        container
            .value('myValue', 123)
            .factory('myValue2', function () {
                return 'abc';
            })
            .service('myService', Service)
        ;

        foo.$inject = ['myValue', 'myValue2', 'myService'];
        function foo() {

        }

        var dependencies = container.resolveDependencies(foo);

        assert.deepEqual(dependencies, [123, 'abc', new Service()]);

    });

    test('resolve nested containers', function () {
        var rootScope = new Container()
                .value('x', 'root-x')
                .value('y', 'root-y')
                .value('z', 'root-z')
            ;

        var scope1 = new Container(rootScope)
                .value('x', 'scope1-x')
                .value('y', 'scope1-y')
            ;

        var scope2 = new Container(scope1)
                .value('x', 'scope2-x')
            ;

        assert.strictEqual('root-x', rootScope.resolve('x'));
        assert.strictEqual('root-y', rootScope.resolve('y'));
        assert.strictEqual('root-z', rootScope.resolve('z'));

        assert.strictEqual('scope1-x', scope1.resolve('x'));
        assert.strictEqual('scope1-y', scope1.resolve('y'));
        assert.strictEqual('root-z', scope1.resolve('z'));

        assert.strictEqual('scope2-x', scope2.resolve('x'));
        assert.strictEqual('scope1-y', scope2.resolve('y'));
        assert.strictEqual('root-z', scope2.resolve('z'));
    });
});
