# nanotimer


A much higher accuracy timer object that makes use of the node.js hrtime function call.

The nanotimer recreates the internal javascript timing functions with higher resolution.


```js

var nanoTimer = require('nanotimer');

```


## .setTimeout(task, timeout, callback)
* timeout, specified in nanoseconds.
* callback is optional

Use:
```js
var task = function () {
    console.log('My task runs!');
};

nanoTimer.setTimeout(task, 1000000000, function(err) {
    if(err) {
        //error
    }
});
```

## .setInterval(task, interval, callback)
* interval, specified in nanoseconds.
* callback is optional

Use:
```js

var task = function () {
    console.log('My task runs!');
};

nanoTimer.setInterval(task, 1000000000, function(err) {
    if(err) {
        //error
    }
});
```

## .time(task, callback)
* callback is optional

### Synchronous Use:
```js
var task = function () {
    console.log('My task runs!');
};

var runtime = nanoTimer.time(task);

```

### Asynchronous Use:
```js
nanotimer.time(task, function(time){
	var timeTook = time;
}
```

