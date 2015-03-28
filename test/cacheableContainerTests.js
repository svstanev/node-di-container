var assert = require('chai').assert;

var di = require('../');

suite('cacheableContainerTests', function(){
    test('should call factory once and cache the result', function() {
        var i = 0;
        var container = di.cacheableContainer()
            .factory('foo', function() {
                return ++i;
            });

        var res;
        for (var j = 0; j < 100; j++) {
            res = container.resolve('foo');
        }

        assert.strictEqual(res, 1);
    });
});