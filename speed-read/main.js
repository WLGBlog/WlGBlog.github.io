// Read Area
var readArea = document.getElementById("readArea");
var currentWord=document.getElementById('currentWord');
// Input Area
var inputArea = document.getElementById("inputArea");
var speed;
var text;

var reversed=false;

var running = true;

var words=[];

var current_word=0;

var read;

function reverseDisplay(){
    read=null;
    if(reversed==false){
        inputArea.style.display="none";
        readArea.style.display="block";
        reversed=!reversed;
        running==true;
        current_word=0;
    } else if(reversed==true){
        location.reload();
        inputArea.style.display="block";
        readArea.style.display="none";
        reversed=!reversed; 
        running==false;
        current_word=0;
    }
}

function submit(){   
    clearInterval(read);
    
    speed = document.getElementById("speed").value;
    text = document.getElementById("text").value;

    reverseDisplay();

    words = text.split(' ');

    var rate = 0
    rate = speed/60;
    rate=1/rate;
    rate=rate*1000;

    read = setInterval(displayWord,rate);

}

function restart(){
    current_word=0;
    clearInterval(read);
    var rate = 0;
    rate = speed/60;
    rate=1/rate;
    rate=rate*1000;

    if(running==false){
        currentWord.innerHTML=words[0];
    }

    read = setInterval(displayWord,rate);
}

function displayWord(){
    if(running==true){
        if(words[current_word]){
            currentWord.innerHTML = words[current_word];
            current_word+=1;
        }
    }
}