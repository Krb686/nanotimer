
var nanotimer = {
        
        'intervalContinue' : false,
        'intervalT1' :  null,
        'intervalCount' : 0,
        'timeoutT1' : 0,
        
        'time':function (task, callback) {
            
         
            //Asynchronous task
            if(callback){
                var t1 = process.hrtime();
               
                task(function(){
                    var time = process.hrtime(t1);
                   callback(time); 
                });
                
            //Synchronous task
            } else {
                var t1 = process.hrtime();
                task();
                return process.hrtime(t1);
            } 
        },
        
        'setInterval': function (task, interval, callback) {
           
            
            if(interval > 0){
                
                //Check and set constant t1 value.
                if(this.intervalT1 == null){
                    this.intervalT1 = process.hrtime();
                    this.intervalContinue = true;
                }
                
                //Check for overflow
                if(interval*this.intervalCount > 100000000000000){
                    this.intervalT1 = process.hrtime();
                    this.intervalCount = 0;
                }
                
                //Get comparison time
                this.difArray = process.hrtime(this.intervalT1);
                this.difTime = (this.difArray[0] * 1000000000) + this.difArray[1];
    
                //If updated time < expected time, continue
                //Otherwise, run task and update counter
                if(this.intervalContinue == true){
                    if(this.difTime < (interval*this.intervalCount)){
                        process.nextTick(function(){nanotimer.setInterval(task, interval, callback);});
                    }
                    else{
                        task();
                        this.intervalCount++;
                        process.nextTick(function(){nanotimer.setInterval(task, interval, callback);});
                    }
                }
                
                //Clean up for exit
                else{
                    this.intervalT1 = null;
                    this.intervalCount = 0;
                    callback();
                }
                
            //If interval = 0, run as fast as possible.
            } else {
                
              //Check and set constant t1 value.
                if(this.intervalT1 == null){
                    this.intervalT1 = process.hrtime();
                    this.intervalContinue = true;
                }
                
                if(this.intervalContinue == true) {
                    task();
                    process.nextTick(function(){nanotimer.setInterval(task, interval, callback);});
                } else {
                    this.intervalT1 = null;
                    this.intervalCount = 0;
                    callback();
                }  
            }
            
        },
        
        'setTimeout' : function (task, delay, callback) {
            
            if(this.timeOutT1 == null){
                this.timeOutT1 = process.hrtime();
            }
     
            var difArray = process.hrtime(this.timeOutT1);
            var difTime = (difArray[0] * 1000000000) + difArray[1];
            
            if(difTime < delay){
                process.nextTick(function(){nanotimer.setTimeout(task, delay, callback);});
            }
            else{
                task();
                this.timeOutT1 = null;
                callback(null);  
            }
                
        },
        
        'clearInterval' : function (){
            this.intervalContinue = false;
        }      
};




exports = module.exports =  nanotimer;





	



	
