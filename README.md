# nanoTimer
# Current Version - 0.2.5

![](https://api.travis-ci.org/Krb686/nanoTimer.png)

A much higher accuracy timer object that makes use of the node.js [hrtime](http://nodejs.org/api/process.html#process_process_hrtime) function call.

The nanotimer recreates the internal javascript timing functions with higher resolution.

##Note

- 1) With the normal timing functions, instead of dealing with the obscurities of multiple setTimeout and 
setInterval calls, now there is a concrete timer object, each of which can handle exactly 1 timeOut and 
setInterval task. This also means a reference is not needed to clear an interval since each timer object is
unique.

- 2) Timer objects use the non-blocking feature **setImmediate** for time counting and synchronization. This requires node v0.10.13 or greater

- 3) Errors in timing are also non-cumulative.  For example, when using the setInterval command, the timer counts
and compares the time difference since starting against the interval length specified and if it has run past the interval, 
it resets.  If the code had an error of 1 millisecond delay, the timer would actually count to 1001 milliseconds before resetting, and that
1 millisecond error would propagate through each cycle and add up very quickly!  To solve that problem, rather than resetting
the interval variable each cycle, it is instead incremented with each cycle count.  So on the 2nd cycle, it compares to 2000 milliseconds, 
and it may run to 2001.  Then 3000 milliseconds, running to 3001, and so on.  This is only limited by the comparison variable potentially overflowing, so I 
somewhat arbitrarily chose a value of 8 quadrillion (max is roughly 9 quadrillion in javascript) before it resets.  Even using nanosecond resolution however, 
the comparison variable would reach 8 quadrillion every 8 million seconds, or every 93.6ish days.

##Usage

```js

var NanoTimer = require('nanotimer');

var timerA = new NanoTimer();


```

Each NanoTimer object can run other functions that are already defined.  This can be done in 2 ways, either with a literal function object, or with a function declaration.

```js
var NanoTimer = require('nanotimer');
var timerObject = new NanoTimer();


var countToOneBillion = function () {
    var i = 0;
    while(i < 1000000000){
        i++;
    }
};

var microsecs = timerObject.time(countToOneBillion, 'u');
console.log(microsecs);
```

or something like this:

```js
var NanoTimer = require('nanotimer');

function main(){
    var timerObject = new NanoTimer();
    
    var microsecs = timerObject.time(countToOneBillion, 'u');
    console.log(microsecs);
}

function countToOneBillion(){
    var i = 0;
    while(i < 1000000000){
        i++;
    }
}

main();
```
  
##Full example

```js
var NanoTimer = require('nanotimer');

//create timer


function main(){
    var timerObject = new NanoTimer();
    
    timerObject.setInterval(areWeThereYet, '1s');
    timerObject.setTimeout(slamOnBrakes, '5s');
    


}

function areWeThereYet(){
    console.log("Billy: Are we there yet?");
}

function slamOnBrakes(){
    console.log(Dad: "I will turn this car around if you ask one more time!");
}
```


## .setTimeout(task, timeout, [callback])
* Calls function 'task' after specified amount of time.
* timeout, specified as a number plus a letter concatenated into a string. ex - '200u', '150n', '35m', '10s'.
* callback is optional

```js

timerA.setTimeout(task, '1s', function(err) {
    if(err) {
        //error
    }
});
```

## .setInterval(task, interval, [callback])
* Repeatedly calls function 'task' after every interval amount of time. If interval is specified as 0, it will run as fast as possible!
* This function is self correcting, error does not propagate through each cycle, as described above.
* interval, specified as a number plus a letter concatenated into a string. ex - '200u', '150n', '35m', '10s'.
* callback is optional, and is only called once the interval is cleared.

```js

timerA.setInterval(task, '100m', function(err) {
    if(err) {
        //error
    }
});
```

## .time(task, format, [callback])
* Returns the amount of time taken to run function 'task'.
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

## .clearInterval()
* Clears current running interval
```js
timerA.clearInterval();
```


# Tests

* Test suite used is mocha.
* Tests also require **should**
* In order for the test to perform properly, the timeout must be altered.
* I prefer running tests with `mocha -R spec -t 10000`

![](https://raw.github.com/Krb686/nanotimer/master/test/0.2.3_test.png "Test Results")

# Performance

-Soon to be added








