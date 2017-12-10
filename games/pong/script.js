var canvas = document.querySelector('#canvas');
var c = canvas.getContext('2d');

var p1_score = 0;
var p2_score = 0;

function init(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

init();

var mouseX, mouseY;
window.addEventListener('mousemove', function(e){
  mouseX = e.x;
  mouseY = e.y;
});

window.addEventListener('resize', init());

function Ball(x,y,dx,dy,w) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.w = w;
  
  this.draw = function(){
    if(this.x > window.innerWidth-this.w){
      p1Scores();
    } else if(this.x < 0){
      p2Scores();
    } else if(this.y>window.innerHeight-this.w){
      this.dy=-this.dy;
    } else if(this.y<0){
      this.dy=-this.dy;
    }
    
    this.dx=this.dx*1.001;
    
    this.x+=this.dx;
    this.y+=this.dy;
    
    c.fillStyle="white";
    c.fillRect(this.x,this.y,this.w,this.w);
  }
  this.update = function(){
    this.draw();
  }
}
var ball = generateBall();
function P1_Paddle(){
  this.w = 30;
  this.h = 150;
  this.x = 30;
  this.y = window.innerHeight/2-this.h/2
  
  this.draw = function() {
    
    if(mouseY){
      this.y=mouseY-this.h/2;
    }
    if(this.y+this.h>window.innerHeight){
      this.y = window.innerHeight-this.h;
    } else if(this.y<0){
      this.y=0;
    }
    
    
    c.fillStyle = "white";
    c.fillRect(this.x,this.y,this.w,this.h);
  }
  this.update = function() {
    this.draw();
  }
}
var p1_paddle = new P1_Paddle();
function P2_Paddle(){
  this.w = 30;
  this.h = 150;
  this.x = window.innerWidth-60;
  this.y = window.innerHeight/2-this.h/2
  
  this.draw = function() {
    
    var desty = ball.y - (this.h-ball.w)*0.7
    this.y += (desty - this.y) * 0.1;
    
    if(this.y+this.h>window.innerHeight){
      this.y = window.innerHeight-this.h;
    } else if(this.y<0){
      this.y=0;
    }
    
    
    c.fillStyle = "white";
    c.fillRect(this.x,this.y,this.w,this.h);
  }
  this.update = function() {
    this.draw();
  }
}
var p2_paddle = new P2_Paddle();

function generateBall() {
  var w = 30;
  var x=window.innerWidth/2-w/2;
  var y=window.innerHeight/2-w/2;
  var dx = getRandomInt(-10,10)*1.25;
  while(dx<6 && dx>-6){
    dx = getRandomInt(-10,10)*1.25;
  }
  var dy = getRandomInt(-7,7)*1.25;
  while(dy<3 && dy>-3){
    dy = getRandomInt(-7,7)*1.25;
  }
  return new Ball(x,y,dx,dy,w);
}

function resetBall(){
  ball = generateBall();
}

function resetTimer() {
  resetBall();
}

function p1Scores() {
  p1_score+=1;
  document.getElementById('p1Txt').innerHTML = p1_score;
  resetTimer();
}
function p2Scores() {
  p2_score+=1;
  document.getElementById('p2Txt').innerHTML = p2_score;
  resetTimer();
}


function animate(){
  window.requestAnimationFrame(animate);
  c.fillStyle="black";
  c.fillRect(0,0,window.innerWidth,window.innerHeight);
  // Draw Ball
  if(ball.x<p1_paddle.w+p1_paddle.x){
    if(ball.y>p1_paddle.y && ball.y+ball.w<p1_paddle.y+p1_paddle.h){
      ball.dx=-ball.dx
    }
  }
  if(ball.x+ball.w>p2_paddle.x){
    if(ball.y>p2_paddle.y && ball.y+ball.w<p2_paddle.y+p2_paddle.h){
      ball.dx=-ball.dx
    }
  }
  ball.update();
  p1_paddle.update();
  p2_paddle.update();
}
animate();
//var ball = new Ball(20,10,15,15,50);
//ball.update();
