var Container = require('./container');
var Optional = require('./optional');

/**
 * A DI container that caches the values once resolved
 * so next time the values are resolved from the cache
 * instead of invoking the factory function/creating the object again.
 * This way we ensure single instance of the dependencies for the current container.
 * @param {Container} parent If present the current container will try the resolve the dependencies from there if not available on the current container.
 * @constructor
 */
module.exports = function(parent) {
    var cache = {};
    var container = new Container(parent);
    var baseResolveCore = container.resolveCore.bind(container);

    return Object.assign(container, {
        resolveCore: function(key) {
            if (key in cache) {
                return Optional.of(cache[key]);
            }

            var result = baseResolveCore(key);
            if (result.hasValue()) {
                cache[key] = result.getValue();
            }

            return result;
        }
    });
};
