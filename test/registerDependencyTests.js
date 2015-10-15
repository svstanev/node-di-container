var assert = require('chai').assert;
var di = require('../src');

suite('register dependency tests', function () {
    var container;

    setup(function () {
        container = di.container();
    });

    suite('value', function(){
        test('value', function () {
            container.value('foo', 123);

            assert.strictEqual(container.resolve('foo'), 123);
        });
    });

    suite('service', function(){
        test('no dependencies', function () {
            function FooService() { }

            container.service('foo', FooService);

            assert.instanceOf(container.resolve('foo'), FooService);
        });

        test('explicit dependencies as array', function () {
            function FooService(x, y) {
                this.value =[x, y];
            }

            container
                .value('foo', 123)
                .value('bar', 'abc')
                .service('baz', ['foo', 'bar', FooService]);

            assert.deepEqual(container.resolve('baz'), new FooService(123, 'abc'));
        });

        test('implicit dependencies from the ctor function signature', function () {
            function FooService(foo, bar) {
                this.value =[foo, bar];
            }

            container
                .value('foo', 123)
                .value('bar', 'abc')
                .service('baz', FooService);

            assert.deepEqual(container.resolve('baz'), new FooService(123, 'abc'));
        });


        test('explicit dependencies with $inject attribute', function () {
            function FooService(x, y) {
                this.value =[x, y];
            }

            FooService.$inject = ['foo', 'bar'];

            container
                .value('foo', 123)
                .value('bar', 'abc')
                .service('baz', FooService);

            assert.deepEqual(container.resolve('baz'), new FooService(123, 'abc'));
        });

    });

    suite('factory', function(){
        test('implicit dependencies from the function signature', function () {
            function foo(bar) {
                return 'abc' + bar;
            }

            function bar() {
                return '123';
            }

            container.factory('bar', bar);
            container.factory('foo', foo);

            assert.strictEqual('abc123', container.resolve('foo'));
        });

        test('explicit dependencies as array', function () {
            function foo(bar) {
                return 'abc' + bar;
            }

            function bar() {
                return '123';
            }

            function baz(x, y) {
                return [x, y];
            }

            container.factory('bar', bar);
            container.factory('foo', foo);
            container.factory('baz', ['foo', 'bar', baz]);

            assert.deepEqual(container.resolve('baz'), ['abc123', '123']);
        });

        test('explicit dependencies - $inject attribute', function () {
            function foo(bar) {
                return 'abc' + bar;
            }

            function bar() {
                return '123';
            }

            function baz(x, y) {
                return [x, y];
            }
            baz.$inject = ['foo', 'bar'];

            container.factory('bar', bar);
            container.factory('foo', foo);
            container.factory('baz', baz);

            assert.deepEqual(container.resolve('baz'), ['abc123', '123']);
        });
    });



});
