var assert = require('chai').assert;
var di = require('../../src');

suite('injector.get', function () {
    var container;
    var injector;

    setup(function () {
        container = di.container()
            .value('myValue', 123)
            .factory('myValue2', function (myValue) {
                return 'abc' + myValue;
            })
        ;

        injector = di.injector(container);
    });

    test('get should return the resolved dependency', function () {
        assert.strictEqual(injector.get('myValue2'), 'abc123');
    });
});
