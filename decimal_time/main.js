Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}

function getTime() {
  var today = new Date();

  var time = {
    hours: today.getHours(),
    minutes: today.getMinutes(),
    seconds: today.getSeconds()
  };
    
  var timeAsNumber = today.getMilliseconds() + (1000*(time.seconds + (60 * (time.minutes + (60 * time.hours)))));
  
  var newTime = timeAsNumber * 100000000 / 86400000;
    
  var currentTime = getCurrentTime(newTime);
  
  return currentTime;
}

function getCurrentTime(newTime) {
  var newHoursNum = newTime/10000000;
  var newHours = Math.floor(newHoursNum);
  var newMinutesNum = (newHoursNum-newHours)*100;
  var newMinutes = Math.floor(newMinutesNum);
  var newSecondsNum = (newMinutesNum-newMinutes)*100;
  var newSeconds = Math.floor(newSecondsNum);
  if(newSeconds.toString().length == 1){
    newSeconds = '0'+newSeconds;
  }
  return "<span><span class='text-primary'>"+(newHours.toString().length==1?'0'+newHours:newHours)+'</span>:<span class="text-success">'+(newMinutes.toString().length==1?'0'+newMinutes:newMinutes)+"</span>:<span class='text-danger'>"+newSeconds+"</span></span>";
}

function get24Time() {
    var now = new Date();

    var time = {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
    };

    return "<span><span class='text-primary'>"+(time.hours.toString().length==1?'0'+time.hours:time.hours)+'</span>:<span class="text-success">'+(time.minutes.toString().length==1?'0'+time.minutes:time.minutes)+"</span>:<span class='text-danger'>"+(time.seconds.toString().length==1?'0'+time.seconds:time.seconds)+"</span></span>";    
}

function displayTime() {
      document.getElementById('decTimeDiv').innerHTML = getTime();
      document.getElementById('normTimeDiv').innerHTML = get24Time();      
}

setInterval(displayTime, 86400/100000);
