var canvas = document.querySelector('#canvas');
var c = canvas.getContext('2d');

window.addEventListener('resize', function(){
  init();
});

var mouseX, mouseY;
window.addEventListener('mousemove', function(e){
  mouseX = e.x;
  mouseY = e.y;
});

function getDistance(x1,y1,x2,y2) {
  var distX = x2-x1;
  var distY = y2-y1;
  
  return Math.sqrt(Math.pow(distX, 2)+Math.pow(distY, 2));
}

var colors = ['#071930','#023852','#03A694','#F24738','#851934'];

function pickColor(){
  var randNum = Math.floor(Math.random() * (colors.length-2) +1);
  return colors[randNum];
}

var circleArray;
function init(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  circleArray = [];
  for (var i=0; i<300; i++){
    var r = getRandomInt(5, 15);
    var x=getRandomInt(r, window.innerWidth-r);
    var y=getRandomInt(r, window.innerWidth-r);
    var dx=getRandomInt(-2, 2);
    var dy=getRandomInt(-2, 2);
  
    circleArray.push(new Circle(x,y,dx,dy,r));
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var maxWidth = 50;
function Circle(x,y,dx,dy,r){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.r = r;
  this.R = r;
  this.color = pickColor();
  
  this.draw = function() {
    c.beginPath();
    c.arc(this.x,this.y,this.r,0,Math.PI*2);
    c.fillStyle = this.color;
    c.fill();
    c.stroke();
    if (this.x+this.r >= window.innerWidth || this.x-this.r<=0){
      this.dx=-this.dx;
    } else if (this.y+this.r>=window.innerHeight || this.y-this.r<=0){
      this.dy=-this.dy;
    }
    if(getDistance(this.x, this.y, mouseX, mouseY)<60 && this.r<maxWidth){
      this.r+=1;
    } else if(this.r>this.R){
      this.r-=1;
    }
    this.x+=this.dx;
    this.y+=this.dy;
  }
  this.update = function(){
    this.draw();
  }
}

init();

function animate() {
  requestAnimationFrame(animate);
  
  c.clearRect(0,0,window.innerWidth, window.innerHeight);
  
  for (var i=0; i<circleArray.length; i++){
    circleArray[i].update();
  }
}

animate()
