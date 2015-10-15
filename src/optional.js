function createOptional(hasValue, value) {
    return {
        hasValue: function() {
            return hasValue;
        },

        getValue: function() {
            if (!hasValue) {
                throw new Error('No value');
            }
            return value;
        }
    }
}

module.exports = {
    of: function(value) {
        return createOptional(true, value);
    },

    empty: function(value) {
        return createOptional(false);
    }
};
