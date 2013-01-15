function NanoTimer(){
    this.intervalContinue = false;
    this.intervalT1 = null;
    this.intervalCount = 0;
    this.timeOutT1 = null;
}

NanoTimer.prototype.time = function(task, format, callback){
  //Asynchronous task
    if(callback){
        var t1 = process.hrtime();
       
        task(function(){
            var time = process.hrtime(t1);
            if(format == 's'){
                callback(time[0] + time[1]/1000000000);
            } else if (format == 'm'){
                callback(time[0]/1000 + time[1]/1000000);
            } else if (format == 'u'){
                callback(time[0]/1000000 + time[1]/1000);
            } else if (format == 'n'){
                callback(time[0]/1000000000 + time[1]);
            } else {
                callback(time); 
            }
        });
        
    //Synchronous task
    } else {
        var t1 = process.hrtime();
        task();
        var t2 = process.hrtime(t1);
        
        if(format == 's'){
            return t2[0] + t2[1]/1000000000;
        } else if (format == 'm'){
            return t2[0]/1000 + t2[1]/1000000;
        } else if (format == 'u'){
            return t2[0]/1000000 + t2[1]/1000;
        } else if (format == 'n'){
            return t2[0]/1000000000 + t2[1];
        } else {
            return process.hrtime(t1);
        }
        
        
    } 
};

NanoTimer.prototype.setInterval = function(task, interval, callback){
    var thisTimer = this;
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
                
                process.nextTick(function(){thisTimer.setInterval(task, interval, callback);});
            }
            else{
                task();
                
                this.intervalCount++;
                process.nextTick(function(){thisTimer.setInterval(task, interval, callback);});
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
            process.nextTick(function(){thisTimer.setInterval(task, interval, callback);});
        } else {
            this.intervalT1 = null;
            this.intervalCount = 0;
            callback();
        }  
    }
};

NanoTimer.prototype.setTimeout = function(task, delay, callback){
    var thisTimer = this;
    if(this.timeOutT1 == null){
        this.timeOutT1 = process.hrtime();
    }

    var difArray = process.hrtime(this.timeOutT1);
    var difTime = (difArray[0] * 1000000000) + difArray[1];
    
    if(difTime < delay){
        process.nextTick(function(){thisTimer.setTimeout(task, delay, callback);});
    }
    else{
        task();
        this.timeOutT1 = null;
        callback(null);  
    }
};

NanoTimer.prototype.clearInterval = function(){
    this.intervalContinue = false;
};


module.exports = NanoTimer;