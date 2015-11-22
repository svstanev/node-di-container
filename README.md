# node-di

[![Build Status](https://travis-ci.org/svstanev/node-di-container.svg?branch=master)](https://travis-ci.org/svstanev/node-di-container)
[![Coverage Status](https://coveralls.io/repos/svstanev/node-di-container/badge.svg?branch=master&service=github)](https://coveralls.io/github/svstanev/node-di-container?branch=master)

Simple AngularJS inspired DI container for node.js

## Getting started

### Installation

```
npm install node-di-container
```

### Example

```
var di = require('node-di-container');

// Some app-specific configuration
var config = require('./config');

// Creates an UserRepository based on the configuration
var UserRepositoryProvider = require('./userRepositoryProvider');

// Uses an UserRepository
var UserManager = require('./userManager');

// Registering the dependencies
var container = di.container()
    .value('config', config)
    .service('userRepositoryProvider', UserRepositoryProvider)
    .factory('userRepository', function(userRepositoryProvider) {
        return userRepositoryProvider.getRepository();
    })
    .service('userManager', UserManager);

var injector = di.injector(container);

// Invoking a function with some dependencies
injector.invoke(function (userManager) {
    ...
});
```

## Basic concepts

### Creating a DI container

The dependency container is the central repository where the dependencies are stored and later resolved from.

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
// Register some global dependencies that will be available to all consumers ...
var global = di.container();

// The scoped container 'sees' its own dependencies and those registered on the parent container (global). All dependencies registered on this container are not available to the parent container though.
var scoped = di.container(global);

// One more level of isolation ...
var local = di.container(scoped);
```

Resolving dependencies always starts from the current container and moving up the chain of parent containers up until it is resolved or there the top most container is reached. Parent containers have no access to the child containers.

Using multiple levels of containers allows parent dependencies to be overridden without actually breaking the parent container and its consumers. To override a parent dependency simply register the new one using the same key.

### Registering dependencies
Dependencies are registered and later resolved by a key. The key is a string that uniquely identifies the dependency in the context of the container.

Depending on how the dependencies are registered there are

#### Values
Values can be any valid JavaScript object and are resolved to the value itself:

```
container.value('myVal', 123);
```

#### Services
Services are defined by a constructor function. This dependency resolves to the result of the constructor function - usually an object instance.

```
container.service('myService', MyService);
```
The constructor function itself may have dependencies that will be resolved before the invocation. For more information how the define dependencies see [Dependency annotation]().

#### Factory
This dependency resolves to the result of the factory function.
```
container.factory('z', function(x, y){
    return (x + y);
});
```

The function itself may have dependencies that will be resolved on invocation. For more information how the define dependencies see [Dependency annotation]().

### Dependency annotation <a id="dependency_annotation"></a>

Functions with dependencies are invoked vie the [injector](). These functions need to be annotated so that the injector knows what dependencies to inject into the function.

There are three ways of annotating functions:

- Implicitly from the function parameters names
```
function f(foo, bar) {
    ...
}
```
- Using the **$inject** annotation
```
function f(arg1, arg2) {
    // arg1 is resolved to foo
    // arg2 is resolved to bar
}

f.$inject = ['foo', 'bar'];
```
- Using the inline array annotation:

When registering a dependency:
```
container.service('myService', ['foo', 'bar', MyService]);
```
```
container.service('myService', ['foo', 'bar', MyService]);
```

Invoking a function:
```
injector.invoke(['foo', 'bar', f])
```
```
injector.createInstance(['foo', 'bar', MyObject]);
```

### Resolving dependencies


To invoke a function or create an object instance with dependencies use an [injector](#injector-object):
```
var di = require('node-di-container');
var container = di.container()
                    .value('foo', 1)
                    .value('bar', 2);

var injector = di.injector(container);
```

For more information how the define dependencies see [Dependency annotation]().

#### Invoking a function with dependencies
```
function foo(foo, bar) {
    return (foo + bar);
}

var result = injector.invoke(foo);
```

#### Invoking a constructor function with dependencies

```
function MyService(foo, bar) {
    ...
}

var myService = injector.createInstance(MyService);
```

#### Resolving dependencies by key

Sometimes it is convenient to simply get any dependency like this:

```
var config = injector.get('config');
```

## API

### Top-level API

#### di

**di** is the entry point to the *node-di-container* library:

```
var di = require('node-di-container');
```

##### di.container([parentContainer])

Creates a dependency container.

Parameters:
- **parentContainer**: (optional)

Returns:
- [container](#container-object)

##### di.cacheableContainer([parentContainer])

Creates a dependency container that cache the dependencies registered as a service or factory.

Parameters:
- **parentContainer**: (optional)

Returns:
- [container](#container-object)

##### di.injector(container)

##### Parameters:
- **container**: the dependency [container](#container-object) to resolve the dependencies from.

##### Returns:
- [injector](#injector-object).

### Container API <a id="container-object"></a>

The object created from [di.container()]() or [di.cacheableContainer()]();

#### container.value(key, value)

##### Parameters:
- **key** (String): a string value that uniquely identifies the dependency in this container;
- **value** (Any): the value this dependency is resolved to.

##### Returns
- the container object

#### container.service(key, constructor)

##### Parameters:
- **key** (String): a string value that uniquely identifies the dependency in this container;
- **constuctor** (Function|Array): the constructor function to be invoked on resolving the dependency. The function can have dependencies itself that will be resolved prior to its invocation. For more information on how to annotate a function with dependencies please see [Dependency annotation](#dependency_annotation).

##### Returns
- the container object

#### container.factory(key, fn)

##### Parameters:
- **key** (String): a string value that uniquely identifies the dependency in this container;
- **fn** (Function|Array): the function to be invoked on resolving the dependency. The function can have dependencies itself that will be resolved prior to its invocation. For more information on how to annotate a function with dependencies please see [Dependency annotation](#dependency_annotation).

##### Returns
- the container object.

#### container.resolve(key)

Returns the resolved dependency by the given key.

##### Parameters
- **key** (String): the key of the dependency to be resolved.

##### Returns
- the resolved dependency.

##### Example
```
var config = container.get('config');
```

### Injector API <a id="injector-object"></a>
The object created from [di.injector()]().

#### injector.invoke(fn)

##### Parameters
- **fn** (Function|Array): the function to be invoked. For more information on how to annotate a function with dependencies please see [Dependency annotation](#dependency_annotation).

##### Returns
- the result of the invocation of the given function **fn**

##### Notes
Actual function invocation:
```
fn.apply(null, [dependencies])
```

#### injector.createInstance(constructor)

##### Parameters
- **constructor** (Function|Array): the constructor function to be invoked. For more information on how to annotate a function with dependencies please see [Dependency annotation](#dependency_annotation).

##### Returns
- the result of the invocation of the given constructor function **constructor**.

##### Notes
Objects are created with [Object.create()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) like this:
```
var obj = Object.create(constructor.prototype);
constructor.apply(obj, [dependencies]);
```

#### injector.get(key)

Returns the resolved dependency by the given key.

##### Parameters
- **key** (string): the key of the dependency to be resolved.

##### Returns
- the resolved dependency.

##### Notes
This is similar to ```container.resolve(key)```.

##### Example
```
var config = injector.get('config');
```
