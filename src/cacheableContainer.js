var util = require('util');
var Container = require('./container').Container;

/**
 * A DI container that caches the values once resolved
 * so next time the values are resolved from the cache
 * instead of invoking the factory function/creating the object again.
 * This way we ensure single instance of the dependencies for the current container.
 * @param {Container} parent If present the current container will try the resolve the dependencies from there if not available on the current container.
 * @constructor
 */
function CacheableContainer(parent) {
    Container.call(this, parent);

    this.cache = {};
}

util.inherits(CacheableContainer, Container);

CacheableContainer.prototype.tryResolveCore = function(key, out) {
    if (key in this.cache) {
        out.value = this.cache[key];
        return true;
    }

    if (Container.prototype.tryResolveCore.call(this, key, out)) {
        this.cache[key] = out.value;
        return true;
    }

    return false;
};



module.exports.CacheableContainer = CacheableContainer;