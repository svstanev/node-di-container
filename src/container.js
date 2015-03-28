var functionUtils = require('./functionUtils');

function Container(parent) {
    this.registry = {};
    this.cache = {};

    this.parent = parent;
}

/**
 * Registers a value
 * @param key the dependency key
 * @param value the value
 * @return {Container} the container
 */
Container.prototype.value = function (key, value) {
    this.registry[key] = function () {
        return value;
    };
    return this;
};

/**
 * Registers a constructor function with optional dependencies
 * @param key the dependency key
 * @param constructor constructor function
 * @return {Container} the container
 */
Container.prototype.service = function (key, constructor) {
    var container = this,
        ctor = this.getFunction(constructor),
        dependencies = this.getDependencies(constructor);

    this.registry[key] = function () {
        var o = Object.create(ctor.prototype);
        ctor.apply(o, container.resolveMulti(dependencies));
        return o;
    };

    return this;
};

/**
 * Register a function that should return a value
 * @param key the dependency key
 * @param fn factory function
 * @return {Container} the container
 */
Container.prototype.factory = function (key, fn) {
    var container = this,
        func = this.getFunction(fn),
        dependencies = this.getDependencies(fn);

    this.registry[key] = function () {
        return func.apply(null, container.resolveMulti(dependencies));
    };

    return this;
};

/**
 * Invokes a given function resolving all dependencies
 * @param fn the function to invoke
 * @return {*} the result of the function's invokation
 */
Container.prototype.invoke = function (fn) {
    var func = this.getFunction(fn),
        dependencies = this.resolveDependencies(fn);

    return func.apply(null, dependencies);
};

/**
 * Invokes the given constructor function, resolving all dependencies
 * @param constructor the constructor function
 * @return {ctor} the object created by the constructor function
 */
Container.prototype.createInstance = function (constructor) {
    var ctor = this.getFunction(constructor),
        dependencies = this.resolveDependencies(constructor);

    var o = Object.create(ctor.prototype);
    ctor.apply(o, dependencies);
    return o;
};

Container.prototype.getFunction = function(fn) {
    if (Array.isArray(fn)) {
        return fn[fn.length - 1];
    }

    return fn;
};

Container.prototype.getDependencies = function (fn) {
    if (Array.isArray(fn.$inject)) {
        return fn.$inject;
    }

    if (Array.isArray(fn)) {
        return Array.prototype.slice.call(fn, 0, -1);
    }

    return functionUtils.getArgNames(fn);
};

Container.prototype.resolveDependencies = function (fn) {
    return this.resolveMulti(this.getDependencies(fn));
};

Container.prototype.resolveMulti = function(keys) {
    var container = this;
    return keys.map(function (key) {
        return container.resolve(key);
    });
};

Container.prototype.resolve = function (key) {
    var out = {};
    if (this.tryResolveCore(key, out)) {
        return out.value;
    }

    if (this.parent) {
        return this.parent.resolve(key);
    }

    return undefined;
};

Container.prototype.tryResolveCore = function(key, out) {
    if (key in this.registry) {
        out.value = this.registry[key]();
        return true;
    }

    return false;
};

module.exports.Container = Container;
