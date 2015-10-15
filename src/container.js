var deprecate = require('util').deprecate;

var Optional = require('./optional');
var Injector = require('./injector');

function Container(parent) {
    var registry = {};
    var container = {};
    var injector = new Injector(container);

    return Object.assign(container, {
        /**
         * Registers a value
         * @param key the dependency key
         * @param value the value
         * @return {Container} the container
         */
        value: function (key, value) {
            registry[key] = function () {
                return value;
            };

            return container;
        },

        /**
         * Registers a constructor function with optional dependencies
         * @param key the dependency key
         * @param constructor constructor function
         * @return {Container} the container
         */
        service: function (key, constructor) {
            registry[key] = function () {
                return injector.createInstance(constructor);
            };

            return container;
        },

        /**
         * Register a function that should return a value
         * @param key the dependency key
         * @param fn factory function
         * @return {Container} the container
         */
        factory: function (key, fn) {
            registry[key] = function () {
                return injector.invoke(fn);
            };

            return container;
        },

        resolveMulti: function(keys) {
            return keys.map(function (key) {
                return container.resolve(key);
            });
        },

        resolve: function (key) {
            var result = container.resolveCore(key);
            if (result.hasValue()) {
                return result.getValue();
            }

            if (parent) {
                return parent.resolve(key);
            }
        },

        resolveCore: function(key) {
            if (key in registry) {
                var value = registry[key]();

                return Optional.of(value);
            }

            return Optional.empty();
        },

        /**
         * Invokes a given function resolving all dependencies
         * @param fn the function to invoke
         * @return {*} the result of the function's invokation
         */
        invoke: deprecate(function (fn) {
            return injector.invoke(fn);
        }, 'container.invoke: Use injector.invoke instead'),

        /**
         * Invokes the given constructor function, resolving all dependencies
         * @param constructor the constructor function
         * @return {ctor} the object created by the constructor function
         */
        createInstance: deprecate(function (constructor) {
            return injector.createInstance(constructor);
        }, 'container.createInstance: Use injector.createInstance instead.'),

        /**
         * For testing purposes only
         */
        resolveDependencies: deprecate(function (fn) {
            return injector.resolveDependencies(fn);
        }, 'container.resolveDependencies: Use injector.resolveDependencies instead'),
    });
}

module.exports = Container;
