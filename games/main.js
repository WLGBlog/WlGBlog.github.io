// Initialize Firebase
      var config = {
        apiKey: "AIzaSyCJT7nmBQc-5g8Qr10XlJfJb6ByLcz7_tE",
        authDomain: "clicker-55a41.firebaseapp.com",
        databaseURL: "https://clicker-55a41.firebaseio.com",
        projectId: "clicker-55a41",
        storageBucket: "clicker-55a41.appspot.com",
        messagingSenderId: "18954001437"
      };
      firebase.initializeApp(config);
      
      var ref = firebase.database().ref('scores');
      
      var name;
      
      const clickCount = document.getElementById('clicks');
      const clickBtn = document.getElementById('clickBtn');
      const saveBtn = document.getElementById('saveBtn');
      const goal = document.getElementById('goal');
      const start = document.getElementById('start');
      const game = document.getElementById('game');
      const startBtn = document.getElementById('startBtn');
      
      startBtn.addEventListener('click', () => {
        start.classList.add('hide');
        game.classList.remove('hide');
        name = document.getElementById('name').value;
        document.getElementById('name').classList.add('hide');
        countDown(60,"status");
      });
    
      function countDown(secs,elem) {
      	var element = document.getElementById(elem);
      	element.innerHTML = secs;
      	var saved = false;
      	if(secs < 1 && saved === false) {
      		clearTimeout(timer);
      		element.innerHTML = '';
      		save();
      		saveBtn.classList.add('hide');
      		saved = true;
      		start.classList.remove('hide');
          game.classList.add('hide');
      		return
      	}
      	secs-=1;
      	var timer = setTimeout('countDown('+secs+',"'+elem+'")',1000);
      }
      var clickArray = [50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
      var clickPowerArray = [5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];
      var scoreArray = [];
      
      var clickArrayCount = 0;
      
      var clicks = 0;
      var clickPower = 1;
      
      goal.innerHTML = 'Next goal: '+clickArray[clickArrayCount];
      
      displayScores();
      
      clickCount.innerHTML = 0;
      
      clickBtn.addEventListener('click', () => {
        // Add a click to the number of clicks
        clicks+=clickPower;
        // Display Number Of Clicks
        clickCount.innerHTML = parseInt(clicks);
        
        if (clicks === clickArray[clickArrayCount]) {
          clickPower = clickPowerArray[clickArrayCount];
          goal.innerHTML = 'Next goal: '+clickArray[clickArrayCount+1];
          clickArrayCount+=1;
        }
      });
      
      function save() {
        if (name != '') {
          saveScore(name, clicks);
        } else {
          saveScore('Anonymous', clicks);
        }
      }; 
      
      saveBtn.addEventListener('click', () => {
        var name = prompt('Enter Name (Leave Blank For Anonymous)');
        if (name != '') {
          saveScore(name, clicks);
        } else {
          saveScore('Anonymous', clicks);
        }
      }); 
      
      function saveScore(name, score){
        if (scoreArray.length >=1){
        for (var i = 0; i<scoreArray.length; i++){
            if(name === scoreArray[i][1] && score >= scoreArray[i][2]){
              firebase.database().ref('scores/'+String(scoreArray[i][0])).remove();
              var newRef = ref.push();
              newRef.set({
                name: name,
                score: score
              });
              alert('Score Saved!');
              break;
            } else if (name== scoreArray[i][1] && score <= scoreArray[i][2]){
              alert('You have not beaten your old score!');
              break;
            } else { 
              var newRef = ref.push();
              newRef.set({
                name: name,
                score: score
              });
              break;
            } 
          }
        } else {
          var newRef = ref.push();
              newRef.set({
                name: name,
                score: score
          });
          alert('Score Saved!');
        }
        
      }
      
      function displayScores() {
          ref.on('value', gotData, errData);
      } 
      
      function gotData(data) {
        var scores = data.val();
        var keys = Object.keys(scores);
        var scoreList = document.getElementById('scoreList');    
        scoreList.innerHTML = "";
        for (var i=0; i<keys.length; i++){
          var k = keys[i];
          var name = scores[k].name;
          var score = scores[k].score;
          scoreArray.push([k, name, score]);
          scoreList.innerHTML += "<li>"+name+": "+score+"</li>"
        }
        
      }
      
      function errData(err) {
          console.log('Error!');
          console.log(err);
      }
      
