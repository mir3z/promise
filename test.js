var Promise = require("./build/promise.min");
var promisesAplusTests = require("promises-aplus-tests");

var adapter = {
    resolved: function (v) {
        return new Promise(function (resolve) {
            resolve(v);
        });
    },
    rejected: function (r) {
        return new Promise(function (resolve, reject) {
            reject(r);
        });
    },
    deferred: function () {
        var resolve, reject;

        return {
            promise: new Promise(function (res, rej) {
                resolve = res;
                reject = rej;
            }),
            resolve: resolve,
            reject: reject
        };
    }
};

console.time('Run time');
promisesAplusTests(adapter, function (err) {
    console.timeEnd('Run time');
    err && console.error(err);
});
