var functionUtils = require('./functionUtils');
var preconditions = require('./preconditions');

var checkIsString = preconditions.checkIsString;
var checkIsFunction = preconditions.checkIsFunction;

function Injector(container) {
    return {
        /**
         * Invokes a given function resolving all dependencies
         * @param fn the function to invoke
         * @return {*} the result of the function's invokation
         */
        invoke: function(fn) {
            checkIsFunction(fn, 'fn expected to be a function --or-- array with last item function');

            var func = getInjectionTarget(fn);
            var dependencies = getDependencies(fn);

            return func.apply(null, container.resolveMulti(dependencies));
        },

        /**
         * Invokes the given constructor function, resolving all dependencies
         * @param constructor the constructor function
         * @return {*} the object created by the constructor function
         */
        createInstance: function(constructor) {
            checkIsFunction(constructor, 'constructor expected to be a function --or-- array with last item function');

            var ctor = getInjectionTarget(constructor);
            var dependencies = getDependencies(constructor);

            var o = Object.create(ctor.prototype);
            ctor.apply(o, container.resolveMulti(dependencies));
            return o;
        },

        /**
         * Returns the resolved dependency with the given key.
         * @param key {string} the dependency key
         * @return {*} the resolved dependency
         */
        get: function(key) {
            checkIsString(key, 'key expected to be string');

            return container.resolve(key);
        },

        /**
         * For testing purposes only
         */
        resolveDependencies: function (fn) {
            checkIsFunction(fn, 'fn expected to be a function');

            return container.resolveMulti(getDependencies(fn));
        },

        /**
         * For testing purposes only
         */
        getDependencies: function (fn) {
            checkIsFunction(fn, 'fn expected to be a function');

            return getDependencies(fn);
        },
    };
}

function getInjectionTarget(fn) {
    if (Array.isArray(fn)) {
        return fn[fn.length - 1];
    }

    return fn;
}

function getDependencies(fn) {
    if (Array.isArray(fn.$inject)) {
        return fn.$inject;
    }

    if (Array.isArray(fn)) {
        return Array.prototype.slice.call(fn, 0, -1);
    }

    return functionUtils.getArgNames(fn);
}

module.exports = Injector;
