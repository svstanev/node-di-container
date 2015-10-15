var assert = require('chai').assert;
var di = require('../src');

suite('resolve dependencies tests', function () {
    var container;

    setup(function () {
        container = di.container();
    });

    test('resolve nested containers', function () {
        var rootScope = di.container()
                .value('x', 'root-x')
                .value('y', 'root-y')
                .value('z', 'root-z')
            ;

        var scope1 = di.container(rootScope)
                .value('x', 'scope1-x')
                .value('y', 'scope1-y')
            ;

        var scope2 = di.container(scope1)
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
