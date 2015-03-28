var assert = require('chai').assert;
var Container = require('../src/container').Container;

suite('create instance tests', function () {
    var container;

    function Service() {
    }

    setup(function () {
        container = new Container()
            .value('myValue', 123)
            .factory('myValue2', function () {
                return 'abc';
            })
            .service('myService', Service)
        ;
    });

    test('createInstance should instantiate object and inject dependencies', function () {

        function Foo(myValue, myValue2, myService) {
            this.value = myValue;
            this.value2 = myValue2;
            this.service = myService;
        }

        Foo.$inject = ['myValue', 'myValue2', 'myService'];

        var foo = container.createInstance(Foo);

        assert.instanceOf(foo, Foo);
        assert.strictEqual(123, foo.value);
        assert.strictEqual('abc', foo.value2);
        assert.instanceOf(foo.service, Service);

    });

    test('create instance with array', function () {
        function Foo(x, y) {
            this.value = [x, y];
        }

        container
            .value('bar', 123)
            .value('baz', 'abc');

        assert.deepEqual(
            container.createInstance(['bar', 'baz', Foo]),
            new Foo(123, 'abc'));
    });
});
