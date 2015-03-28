var Container = require('./src/container').Container;
var CacheableContainer = require('./src/cacheableContainer').CacheableContainer;

function createContainer(parent) {
  return new Container(parent);
}

function createCacheableContainer(parent) {
    return new CacheableContainer(parent);
}

module.exports.container = createContainer;
module.exports.cacheableContainer = createCacheableContainer;
