module.exports = {
    isFunction: function (subject) {
        return typeof subject === 'function';
    },

    isObject: function (subject) {
        return typeof subject === 'object';
    },

    defer: function (fn) {
        setTimeout(fn, 0);
    },

    identity: function () {
        return function (v) {
            return v;
        }
    },

    throwErr: function () {
        return function (err) {
            throw err;
        }
    }
};