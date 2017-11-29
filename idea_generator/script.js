// Initialize Firebase
var config = {
    apiKey: "AIzaSyAORTTwzjoTYPG2JcQIgjbgUp71VO1-xcc",
    authDomain: "idea-generator-fe8f2.firebaseapp.com",
    databaseURL: "https://idea-generator-fe8f2.firebaseio.com",
    projectId: "idea-generator-fe8f2",
    storageBucket: "",
    messagingSenderId: "306819692107"
};
firebase.initializeApp(config);

var db = firebase.firestore();

var ideas=[];
//[['Write A Short Story'],['Start A Journal'],['Make A Better Vehicle'],['Make a better way to communicate'],['Make an app to automate everything'],['Make a versatile keyboard and mouse'],['Make AI that can beat you at chess'],['Start A blog'],['Invent a sport that is cheap, and still tiring'],['Make affordable clean energy'],['Make an article of clothing in your own style'],['Learn something on udemy'],['Design the ultimate game with strategy and tactics'],['Enter a science competition']];
var ideasPicked = [];

db.collection("ideas").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        ideas.push([doc.data().title]);
    });
});


generateIdea(1);

$('#generateIdea').click(function(){
    generateIdea(1);
});

function generateIdea(idea){
    var index = getRandomInt(0,ideas.length-1);
    var wasUsed = false;

    if(!idea){
        return;
    }

    for(var i=0; i<ideasPicked.length; i++){
        if(index==ideasPicked[i]){
            wasUsed=true;
            generateIdea(1);
            return;
        } else{
            wasUsed=false;
        }
    }

    if(wasUsed==false){
        ideasPicked.push(index);        
    }

    $('#ideaOutput').text(ideas[index]);

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

$('.addProjectBtn').click(function(){
    $('.getIdea').hide();
    $('.submitIdea').show();
    $('.addProjectBtn').hide();
    $('.backBtn').show();
});

$('.backBtn').click(function(){
    $('.getIdea').show();
    $('.submitIdea').hide();
    $('.addProjectBtn').show();
    $('.backBtn').hide();
});