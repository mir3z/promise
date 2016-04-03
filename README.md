<a href="http://promises-aplus.github.com/promises-spec">
    <img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png"
         align="right" alt="Promises/A+ logo" />
</a>

# Promise.js

This is the Promises/A+ compliant implementation of Promises.

## API

### Creating promises

```
var p = new Promise();
```

or
 
```
var p = new Promise(function (resolve, reject) {
    // ...
});
```

### Exposed methods

* `resolve(value)`
* `reject(reason)`
* `then(onFulfilled, onRejected)`
* `done(onFulfilled, onRejected)`
