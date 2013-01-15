# nanoTimer
# Current Version - 0.1.9

A much higher accuracy timer object that makes use of the node.js hrtime function call.

The nanotimer recreates the internal javascript timing functions with higher resolution.

-With the normal timing functions, instead of dealing with the obscurities of multiple setTimeout and 
setInterval calls, now there is a concrete timer object, each of which can handle exactly 1 timeOut and 
setInterval task. This also means a reference is not needed to clear an interval since each timer object is
unique.



```js

var NanoTimer = require('nanotimer');

var timerA = new NanoTimer();


```

Each NanoTimer object's functions work with defined functions as such:
```js
var task = function () {
    console.log('My task runs!');
};
```


## .setTimeout(task, timeout, callback)
* Calls task after specified amount of time, timeout (in nanoseconds).
* timeout, specified in nanoseconds.
* callback is optional

Use:
```js

timerA.setTimeout(task, 1000000000, function(err) {
    if(err) {
        //error
    }
});
```

## .setInterval(task, interval, callback)
* Repeatedly calls task after every interval amount of nanoseconds.
* This function is self correcting, error does not propagate through each cycle.
* interval, specified in nanoseconds.
* callback is optional

Use:
```js

timerA.setInterval(task, 1000000000, function(err) {
    if(err) {
        //error
    }
});
```

## .time(task, format, callback)
* Returns the amount of time taken to run task.
* format specifies the units time will be returned in. Options are 's' for seconds, 'm' for milliseconds, 'u' for microseconds, 
and 'n' for nanoseconds. if no format is specified, returns the default array of [s, n] where s is seconds and n is nanoseconds.
* callback is optional

### Synchronous Use:
```js

var runtimeSeconds = timerA.time(task, 's');

```

### Asynchronous Use:
```js
timerA.time(task, function(time){
	var runtime = time;
}
```


# Tests

* Test suite used is mocha.
* In order for the test to perform properly, the timeout must be altered.
* I prefer running tests like `mocha -R spec -t 10000`

![](https://github.com/Krb686/nanotimer/blob/master/test/0.1.9.png "Test Results")









