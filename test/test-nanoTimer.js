var nanoTimer = require('../lib/nanoTimer.js');
var mocha = require('mocha');
var should = require('should');




var task = function(){
	var count = 0;
	for(var i=0;i<100000;i++){
		count++;
	};
	
};

var task2 = function(){
	console.log('hey');
};

var task3 = function(){
	HrTimer.clearInterval();
};

var task4 = function(){
	console.log('HELLLOOOO');
};




//Begin tests


//Test 1
var numSamples	= 1000;
var total	= 0;
var avg		= 0;
for(var i=0;i<numSamples;i++){
	var timeTook = HrTimer.time(task);
	timeTook = timeTook[0] + (timeTook[1] / 1000000000);
	total+=timeTook;
}

avg = total/numSamples;
console.log(avg);
console.log('========');

setInterval(task2, 1000);
HrTimer.setInterval(task2, 1000000000);


