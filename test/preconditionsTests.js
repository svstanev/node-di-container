var assert = require('chai').assert;

var preconditions = require('../src/preconditions');

var checkIsFunction = preconditions.checkIsFunction;
var checkIsString = preconditions.checkIsString;

suite('preconditions', function() {
    suite('checkIsString', function() {
        test('it should return the given string argument', function() {
            assert.strictEqual(checkIsString('abc'), 'abc');
        });

        test('it should throw an error if invoked with other than string', function() {
            assert.throws(function() { checkIsString(123) }, /String expected/);
        });

        test('it should throw an error with the given message if invoked with other than string', function() {
            assert.throws(function() { checkIsString(123, 'Hello world') }, /Hello world/);
        });
    });

    suite('checkIsFunction', function() {
        test('it should return the function passed', function() {
            var fn = function() {};
            assert.strictEqual(checkIsFunction(fn), fn);
        });

        test('it should return the array passed if last item is function', function() {
            var fn = function() {};
            var arr = ['a', 'b', fn];
            assert.strictEqual(checkIsFunction(arr), arr);
        });

        test('it shoult throw an error if invoked with other the funciton or array with last item function', function() {
            assert.throws(function() { checkIsFunction(123) }, /Function expected/);
        });

        test('it shoult throw an error if invoked with other the funciton or array with last item function', function() {
            assert.throws(function() { checkIsFunction([ 123 ]) }, /Array with last item function expected/);
        });
    });
});
