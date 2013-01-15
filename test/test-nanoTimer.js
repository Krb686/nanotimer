var NanoTimer = require('../lib/nanotimer.js');
var should = require('should');

var timerA = new NanoTimer();


describe('nanoTimer', function(){
    //######## time function #########
    describe('.time', function(){
        
        //Test 1 - Synchronous Task Timing
        it('#1 synchronous task 1000 samples', function(){
            
            var times = [];
            var i = 0;
            var samples = 1000;
            
            var syncTask = function(){
                var count = 0;
                for(var i=0;i<1000000;i++){
                    count++;
                };
                
            };
            
            for(i=0;i<samples;i++){
                times.push(timerA.time(syncTask, 'm'));
            }
            
            
            times.length.should.eql(1000);
            
        });
        
        //Test 2 - Asynchronous Task Timing
        it('#2 asynchronous task 1000 samples', function(done){
            
            var i = 0;
            var numSamples = 10;
            var doneCount = 0;
            var times = [];
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
            
            for(var j=0;j<numSamples;j++){
                timerA.time(asyncTask, 's', function(time){
                    should.exist(time);
                    var asyncTime = time;
                    times.push(asyncTime);
                    doneCount++;
                    if(doneCount == numSamples){
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
                for(var i=0;i<100000;i++){
                    count++;
                }; 
            };
            
            timerA.setTimeout(task, 2000000000);
            done();
 
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
            
            timerA.setTimeout(runAsync, 1000000000, function() {
                done();
            });
            
        });
    });
    
    //######## setInterval function ########
    describe('setInterval', function(){
        it('#5 successfully works\n\n', function(done){
            var task = function(){
                var count = 0;
                for(var i=0;i<100000;i++){
                    count++;
                };    
            };
            
            timerA.setInterval(task, 1000000000, function(){
                done();
            });
            
            timerA.setTimeout(function(){
                timerA.clearInterval();
            }, 3000000000);

        });
        
    });
});




