var assert = require('chai').assert;
var Container = require('../src/container').Container;

suite('invoke tests', function() {
  var container;

  function Service() {
  }

  setup(function(){
    container = new Container()
      .value('myValue', 123)
      .factory('myValue2', function () { return 'abc'; })
      .service('myService', Service)
    ;
  });

  test('invoke should call the function and inject dependencies', function() {
    foo.$inject = ['myValue', 'myValue2', 'myService'];
    function foo(x, y, z) {
      return [x, y, z];
    }

    assert.deepEqual(container.invoke(foo), [123, 'abc', new Service()]);
  });

    test('invoke with array', function() {
        function foo(x, y) {
            return [x, y];
        }

        container
            .value('bar', 123)
            .value('baz', 'abc');

        assert.deepEqual(container.invoke(['bar', 'baz', foo]), [123, 'abc']);
    });
});
