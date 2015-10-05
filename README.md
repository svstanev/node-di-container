# node-di 

[![Build Status](https://travis-ci.org/svstanev/node-di.svg?branch=master)](https://travis-ci.org/svstanev/node-di) 
[![Coverage Status](https://coveralls.io/repos/svstanev/node-di/badge.svg?branch=master&service=github)](https://coveralls.io/github/svstanev/node-di?branch=master)

Simple AngularJS inspired DI container for node.js

## Usage

### Creating a DI container

To create a DI container:
```
var di = require('node-di');

var container = di.container();
```

To create a DI container that caches resolved dependencies:
```
var container = di.cacheableContainer();
```

Containers can be chained, creating scopes that help better organize dependencies:
```
var global = di.cacheableContainer();
var scoped = di.cacheableContainer(global);
var local = di.cacheableContainer(scoped);
```

Resolving dependecies always starts from the current container and moving down the chain up until it is resolved or there is no parent.

### Registering dependencies
Dependencies can be defined in three ways - as values, service or factory function:

#### Values
Values can be any valid JavaScript object and are resolved to the value they are registered with:
```
container.value('myVal', 123);
```

#### Services
Services a defined by a constructor function. This dependency resolves to the result of the contsructor function. The function may have dependencies that will be resolved on invocation.
```
container.service('myService', MyService);
```

Dependencies of the constructor function may be resolved by the constructor function's argument names, through the $inject annotation or when registering the service:
```
function MyService(a, b, c) { ... }
MyService.$inject = ['dep1', 'dep2', 'dep3'];

container.service(MyService);

container.service(['dep1', 'dep2', 'dep3', MyService]);
```

#### Factory
This dependency resolves to the result of the factory function. The function may have dependencies that will be resolved on invocation.
```
container.factory(function(dep1, dep2){
    return dep1 + dep2;
});
```

Dependencies of the factory function may be resolved by the factory function's argument names, through the $inject annotation or when registering the factory:
```
function fn(a, b, c) { ... }
fn.$inject = ['dep1', 'dep2', 'dep3'];

container.factory(fn);

container.factory(['dep1', 'dep2', 'dep3', fn]);
```

### Resolving dependencies

#### Invoking a function with dependencies
Dependencies of the function may be resolved by the function's argument names, through the $inject annotation or when invoking the function:
```
var result = di.container()
    .value('x', 1)
    .value('y', 2)
    .invoke(function add(x, y) {
        return x + y;
    })
    ;
        
var result = di.container()
    .value('x', 1)
    .value('y', 2)
    .invoke(['x', 'y', function(a, b) {
        return a + b;
    }])
    ;
```

#### Invoking a constructor function with dependencies
```
var myObject = di.container()
    .value('x', 1)
    .value('y', 2)
    .createInstance(MyObject);
```

### Example
```
var di = require('node-di');

var global = di.cacheableContainer()
    // registers a value
    .value('foo', 123)

    // registers a service - constructor function - with optional dependencies
    .service('bar', Bar);

// create a scoped container; dependencies are first resolved against it; if missing - try resolving from the parent container (global)
var scoped = di.cacheableContainer(global)
    // registers a factory function with optional dependencies
    .factory('baz', function(foo, bar) {
        return foo + bar.getValue();
    });

// Invoke a function with dependencies:
// 1) dependencies can be resolved by function arguments' names; arguments' names should match dependencies
var result = scoped.invoke(function(foo, bar, baz) {
    return foo + bar.getValue() + baz;
});

// 2) explicitly defines dependencies with function.$inject; function arguments' names may not match dependencies
function fn(a, b, c) {
    return a + b.getValue() + c;
}

fn.$inject = ['foo', 'bar', 'baz'];

var result = scoped.invoke(fn);

// 3) explicitly defines dependencies when invoking the function; function arguments' names may not match dependencies
var result = scoped.invoke(['foo', 'bar', 'baz', function(a, b, c) {
    return a + b.getValue() + c;
}]);

// Constructor functions:
// Dependencies of the constructor function may be resolved by arguments' names, explicitly defined through the $inject annotation, or passed to the container.createInstance(array):
function Boo(foo, bar, baz) {
}

var o = scoped.createInstance(Boo);

/**
* @param foo external dependency that will be resolved by the DI container when invoking the constructor function
*/
function Bar(foo) {
    this.foo = foo;
}

Bar.prototype.getValue = function() {
    return this.foo;
};

```
