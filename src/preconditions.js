var util = require('util');
var isFunction = util.isFunction;
var isString = util.isString;

function tail(arr) {
    return arr[arr.length - 1];
}

function checkIsFunction(arg, msg) {
    if (Array.isArray(arg)) {
        if (isFunction(tail(arg))) {
            return arg;
        }

        throw new Error(msg || 'Array with last item function expected');
    }

    if (isFunction(arg)) {
        return arg;
    }

    throw new Error(msg || 'Function expected');
};

function checkIsString(arg, msg) {
    if (!isString(arg)) {
        throw new Error(msg || 'String expected');
    }
    return arg;
};


module.exports.checkIsFunction = checkIsFunction;
module.exports.checkIsString = checkIsString;
