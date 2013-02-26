var NanoTimer = require('../lib/nanoTimer.js');
var should = require('should');

var timerA = new NanoTimer();


describe('nanoTimer', function(){
    //######## time function #########
    describe('.time', function(){
        
        //Test 1 - Synchronous Task Timing
        it('#1 synchronous task 1000 samples', function(){
            
            var times = [];
            var i = 0;
            var numSamples = 1000;
            
            //Simple count to 1 million task
            var syncTask = function(){
                var count = 0;
                var i = 0;
                for(i=0;i<1000000;i++){
                    count++;
                };
            };
            
            //Test numSamples # of times
            for(i=0;i<numSamples;i++){
                times.push(timerA.time(syncTask, 'm'));
            }
            
            //Assertions
            times.length.should.eql(1000);
            
            var avg = 0;
            var max = 0;
            var min = 1000000000000000000;
            for(i=0;i<1000;i++){
                avg+=times[i];
                if(times[i] > max){
                    max = times[i];
                }
                
                if(times[i] < min){
                    min = times[i];
                }
            }
            
            avg = avg/1000;
            console.log('\n\t\t - Average time: ' + avg + ' milliseconds');
            console.log('\t\t - Max time: ' + max + ' milliseconds');
            console.log('\t\t - Min time: ' + min + ' milliseconds');
            
        });
        
        //Test 2 - Asynchronous Task Timing
        it('#2 asynchronous task 1000 samples', function(done){
            
            var i = 0;
            var j = 0;
            var numSamples = 10;
            var doneCount = 0;
            var times = [];
            
            //Count to 1000 asynchronously
            var asyncTask = function(callback){
                
                if(i < 1000){
                    process.nextTick(function(){
                        asyncTask(callback);
                    });
                } else {
                    callback();
                }
                
                i++;
            };
            
            //Run 10 instances of async task.
            for(j=0;j<numSamples;j++){
                timerA.time(asyncTask, 's', function(runtime){
                    should.exist(runtime);
                    times.push(runtime);
                    doneCount++;
                    if(doneCount == numSamples){
                        var avg = 0;
                        var max = 0;
                        var min = 1000000000000000000;
                        for(i=0;i<10;i++){
                            avg+=times[i];
                            if(times[i] > max){
                                max = times[i];
                            }
                
                            if(times[i] < min){
                                min = times[i];
                            }
                        }
            
                        avg = avg/1000;
                        console.log('\n\t\t - Average time: ' + avg + ' seconds');
                        console.log('\t\t - Max time: ' + max + ' seconds');
                        console.log('\t\t - Min time: ' + min + ' seconds');
                        done(); 
                    }
                });
            } 
        });
    });
    
    
    //######## timeout function ########
    describe('.setTimeout', function(){
        //Test 3 - sync task
        it('#3 sync wait 2 seconds\n\n', function(done){
            var task = function(){
                var count = 0;
                for(var i=0;i<1000000;i++){
                    count++;
                }; 
            };
            timerA.setTimeout(task, '2s', function(data){
                var waitTime = data.waitTime;
                console.log('\t\t - Expected wait: 2 seconds');
                console.log('\t\t - Actual wait: ' + waitTime/1000000000 + ' seconds');
                var waitedLongEnough = (waitTime >= 2000000000);
                waitedLongEnough.should.be.true;
                done();
            });
            
        });
        
        //Test 4 - async task
        it('#4 successfully works with async tasks\n\n', function(done){
            var asyncTask = function(callback, i){
                if(!i){
                    var i = 0;
                }
                
                if(i < 1000){
                    process.nextTick(function(){
                        i++;
                        asyncTask(callback, i);
                    });
                } else {
                    callback('got data');
                }
            };
            
            var runAsync = function(){
                var msg = '';
                asyncTask(function(data){
                    msg = data;
                    msg.should.eql('got data');
                });  
            };
            
            timerA.setTimeout(runAsync, '1s', function(data) {
                var waitTime = data.waitTime;
                console.log('\t\t - Expected wait: 1 seconds');
                console.log('\t\t - Actual wait: ' + waitTime/1000000000 + ' seconds');
                var waitedLongEnough = (waitTime >= 1000000000);
                waitedLongEnough.should.be.true;
                done();
            });
            
        });
    });
    
    //######## setInterval function ########
    describe('setInterval', function(){
        it('#5 successfully works\n\n', function(done){
        
            var task = function(){
                console.log('\t\t - task was run!');
            };
            
            
            timerA.setInterval(task, '1000s', function(){
                done();
            });
            
            timerA.setTimeout(function(){
                timerA.clearInterval();
            }, '3s');

        });
        
    });
});




