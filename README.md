# nanoTimer

A much higher accuracy timer object that makes use of the node.js hrtime function call.

The nanotimer recreates the internal javascript timing functions with higher resolution.

-With the normal timing functions, instead of dealing with the obscurities of multiple setTimeout and 
setInterval calls, now there is a concrete timer object, each of which can handle exactly 1 timeOut and 
setInterval task. This also means a reference is needed to clear an interval since each timer object is
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

## .time(task, callback)
* callback is optional

### Synchronous Use:
```js

var runtime = timerA.time(task);

```

### Asynchronous Use:
```js
timerA.time(task, function(time){
	var runtime = time;
}




