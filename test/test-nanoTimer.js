var nanoTimer = require('../lib/nanoTimer.js').nanoTimer;
var should = require('should');



describe('nanoTimer', function(){
    //######## time function #########
    describe('.time', function(){
        
        //Test 1 - Synchronous Task Timing
        it('successfully times a synchronous task', function(){
            
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
                times.push(nanoTimer.time(syncTask));
            }
            
            
            times.length.should.eql(1000);
            
        });
        
        //Test 2 - Asynchronous Task Timing
        it('successfully times an asynchronous task', function(done){
            
            var i = 0;
            var asyncTime = 0;
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
            
            nanoTimer.time(asyncTask, function(time){
                asyncTime = time;
                done();
            });
        });
        
        
    });
    
    
    //######## timeout function ########
    describe('.setTimeout', function(){
        //Test 3 - sync task
        it('successfully works with sync tasks\n\n', function(done){
            var task = function(){
                var count = 0;
                for(var i=0;i<100000;i++){
                    count++;
                }; 
            };
            
            nanoTimer.setTimeout(task, 1000000000, function(){
                done();
            });
 
        });
        
        //Test 4 - async task
        it('successfully works with async tasks\n\n', function(done){
            var i = 0;
            var asyncTask = function(callback){
                
                if(i < 1000){
                    process.nextTick(function(){
                        asyncTask(callback);
                    });
                } else {
                    callback('got data');
                }
                i++;
            };
            
            var runAsync = function(){
                var msg = '';
                asyncTask(function(data){
                    msg = data;
                    msg.should.eql('got data');
                });  
            };
            
            nanoTimer.setTimeout(runAsync, 1000000000, function(err) {
                if (err) {
                    
                } else {
                    done();
                }   
            });
            
        });
    });
    
    //######## setInterval function ########
    describe('setInterval', function(){
        it('successfully works\n\n', function(done){
            var task = function(){
                var count = 0;
                for(var i=0;i<100000;i++){
                    count++;
                };    
            };
            
            nanoTimer.setInterval(task, 1000000000, function(){
                done();
            });
            
            setTimeout(function(){
                nanoTimer.clearInterval();
            }, 3000);

        });
        
    });
});




