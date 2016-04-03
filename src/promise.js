var utils = require('./utils');

function Promise(executor) {
    var PENDING = 0;
    var FULFILLED = 1;
    var REJECTED = 2;

    var queue = [];

    this.state = PENDING;
    this.value = null;

    function resolve(promise, x) {
        if (promise === x) {
            transition(promise, REJECTED, new TypeError());
        }

        else if (x instanceof Promise) {
            if (x.state === PENDING) {
                x.then(
                    resolve.bind(null, promise),
                    transition.bind(null, promise, REJECTED)
                )
            } else {
                transition(promise, x.state, x.value);
            }
        }

        else if (!!x && (utils.isFunction(x) || utils.isObject(x))) {
            var called = false;

            try {
                var then = x.then;
                if (utils.isFunction(then)) {
                    then.call(
                        x,
                        function (y) {
                            called || resolve(promise, y);
                            called = true;
                        },
                        function (r) {
                            called || transition(promise, REJECTED, r);
                            called = true;
                        }
                    )
                } else {
                    transition(promise, FULFILLED, x);
                }
            } catch (e) {
                called || transition(promise, REJECTED, e);
                called = true;
            }
        } else {
            transition(promise, FULFILLED, x);
        }
    }

    function transition(promise, state, value) {
        if (promise.state === state || promise.state !== PENDING || (state !== FULFILLED && state !== REJECTED)) {
            return;
        }

        promise.value = value;
        promise.state = state;

        run(promise);
    }


    function run(promise) {
        utils.defer(function () {
            if (promise.state === PENDING) {
                return;
            }

            while (queue.length) {
                var handler = queue.shift();

                try {
                    var fn = promise.state === FULFILLED ?
                        (handler.fulfill || utils.identity()) :
                        (handler.reject || utils.throwErr());

                    resolve(promise, fn(promise.value));
                } catch (e) {
                    transition(promise, REJECTED, e);
                }
            }
        });
    }

    this.then = function (onFulfilled, onRejected) {
        var self = this;

        return new Promise(function (resolve, reject) {
            return self.done(
                function (value) {
                    var fn = utils.isFunction(onFulfilled) ? onFulfilled : utils.identity();

                    try {
                        return resolve(fn(value))
                    } catch (e) {
                        return reject(e);
                    }
                },
                function (err) {
                    var fn = utils.isFunction(onRejected) ? onRejected : utils.throwErr();

                    try {
                        return resolve(fn(err))
                    } catch (e) {
                        return reject(e);
                    }
                }
            )
        });
    };

    this.done = function (onFulfilled, onRejected) {
        queue.push({
            fulfill: utils.isFunction(onFulfilled) ? onFulfilled : null,
            reject: utils.isFunction(onRejected) ? onRejected : null
        });

        run(this);
    };

    this.reject = function (reason) {
        transition(this, REJECTED, reason);
    };

    this.resolve = function (value) {
        resolve(this, value);
    };

    if (utils.isFunction(executor)) {
        executor(
            resolve.bind(null, this),
            transition.bind(null, this, REJECTED)
        )
    }
}

module.exports = Promise;