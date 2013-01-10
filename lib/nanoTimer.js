HrTimer = {
	
	
	//Interval variables
	intervalContinue:false,
	intervalT1:null,
	intervalCount:0,
	
	//timeout variables
	timeOutT1:null,
	
	time: function(task) {
		var t1 = process.hrtime();
		task();
		return process.hrtime(t1);
	},
	
	setInterval: function(task, interval){
			
	
		//Check and set constant t1 value.
		if(this.intervalT1 == null){
			this.intervalT1 = process.hrtime();
			this.intervalContinue = true;
		}
		
		//Check for overflow
		if(interval*this.intervalCount > 100000000000000){
			this.intervalCount = 0;
			this.intervalT1 = process.hrtime();
		}
		
		//Get comparison time
		this.difArray = process.hrtime(this.intervalT1);
		this.difTime = (this.difArray[0] * 1000000000) + this.difArray[1];
		
		
		
		
		
		//If updated time < expected time, continue
		//Otherwise, run task and update counter
		if(this.intervalContinue == true){
			if(this.difTime < (interval*this.intervalCount)){
				process.nextTick(function(){this.HrTimer.setInterval(task, interval);});
			}
			else{
				console.log(this.difArray)
				task();
				this.intervalCount++;
				process.nextTick(function(){this.HrTimer.setInterval(task, interval);});
			}
		}
		
		//Clean up for exit
		else{
			this.intervalT1 = null;
			this.intervalCount = 0;
		}
		
	},
	
	setTimeout: function(task, delay){
	
		if(this.timeOutT1 == null){
			this.timeOutT1 = process.hrtime();
		}
		
		
		
		var difArray = process.hrtime(this.timeOutT1);
		var difTime = (difArray[0] * 1000000000) + difArray[1];
		
		
		if(difTime < delay){
			process.nextTick(function(){this.HrTimer.setTimeout(task, delay);});
		}
		else{
			task();
			this.timeOutT1 = null;
		}
			
	},
	
	clearInterval: function(){
		this.intervalContinue = false;
	}
			
};

module.exports = HrTimer;
	



	