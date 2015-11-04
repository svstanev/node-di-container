var assert = require('chai').assert;
var di = require('../src');

suite('globalExports', function globalExportsTests() {
    test('di exports container function', function testContainer() {
        assert.isFunction(di.container);
    });

    test('di exports cacheableContainer function', function testCacheableContainer() {
        assert.isFunction(di.cacheableContainer);
    });

    test('di exports injector function', function testInjector() {
        assert.isFunction(di.injector);
    });
});
