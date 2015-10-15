var Container = require('./container');
var CacheableContainer = require('./cacheableContainer');
var Injector = require('./injector');

module.exports = {
    container: function createContainer(parent) {
        return new Container(parent);
    },

    cacheableContainer: function createCacheableContainer(parent) {
        return new CacheableContainer(parent);
    },

    injector: function createInjector(container) {
        return new Injector(container);
    },
};
