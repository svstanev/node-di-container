# node-di 

[![Build Status](https://travis-ci.org/svstanev/node-di.svg?branch=master)](https://travis-ci.org/svstanev/node-di) 
[![Coverage Status](https://coveralls.io/repos/svstanev/node-di/badge.svg?branch=master&service=github)](https://coveralls.io/github/svstanev/node-di?branch=master)

Simple AngularJS inspired DI container for node.js

## Usage

### Creating a DI container

To create a DI container:

```
var di = require('node-di-container');

var container = di.container();
```

To create a DI container that caches the resolved dependencies:

```
var container = di.cacheableContainer();
```

Containers can be chained, creating scopes that help better organize dependencies:
```
var global = di.cacheableContainer();
var scoped = di.cacheableContainer(global);
var local = di.cacheableContainer(scoped);
```

Resolving dependecies always starts from the current container and moving up the chain of parent container up until it is resolved or there the top most container is reached.

### Registering dependencies
Dependencies can be registered in three ways - as values, service or factory function:

#### Values
Values can be any valid JavaScript object and are resolved to the value they are registered with:

```
container.value('myVal', 123);
```

#### Services
Services are defined by a constructor function. This dependency resolves to the result of the contsructor function (usually an object instance). The constructor function may have dependencies that will be resolved on invocation.
```
container.service('myService', MyService);
```

Dependencies to be injected into the constructor function may be resolved from the constructor function's argument names:
```
function MyService(dep1, dep2, dep3) { ... }

container.service(MyService);
```

, through the $inject annotation:

```
function MyService(a, b, c) { ... }
MyService.$inject = ['dep1', 'dep2', 'dep3'];

container.service(MyService);
```

or when registering the service:
```
function MyService(a, b, c) { ... }

container.service(['dep1', 'dep2', 'dep3', MyService]);
```

#### Factory
This dependency resolves to the result of the factory function. The function may have dependencies that will be resolved on invocation.
```
container.factory(function(dep1, dep2){
    return dep1 + dep2;
});
```

Dependencies of the factory functions may be resolved by the factory function's argument names:

```
function fn(dep1, dep2, dep3) { ... }
container.factory(fn);
```

, through the $inject annotation: 

```
function fn(a, b, c) { ... }
fn.$inject = ['dep1', 'dep2', 'dep3'];

container.factory(fn);
```

or when registering the factory:

```
function fn(a, b, c) { ... }
container.factory(['dep1', 'dep2', 'dep3', fn]);
```

### Resolving dependencies
To invoke a function or create an onject instance with dependencies use an *injector*:
```
var di = require('node-di-container');
var container = di.container()
                    .value('x', 1)
                    .value('y', 2);
                     
var injector = di.injector(container);
```

#### Invoking a function with dependencies
Dependencies of the function may be resolved by the function's argument names:

```
function foo(a, b) {
    return a + b;
}

var result = injector.invoke(foo);
```

, through the $inject annotation:

```
function foo(a, b) {
    return a + b;
}
foo.$inject = ['x', 'y'];

var result = injector.invoke(foo);

```

or when invoking the function:

```
function foo(a, b) {
    return a + b;
}
var result = injector.invoke(['x', 'y', foo]);
```

#### Invoking a constructor function with dependencies

```
function MyService(x, y) {
    ...
}

var myService = injector.createInstance(MyService);
```

```
function MyService(a, b) {
    ...
}
MyService.$inject = ['x', 'y'];

var myService = injector.createInstance(MyService);
```

```
function MyService(a, b) {
    ...
}

var myService = injector.createInstance(['x', 'y', MyService]);
```
