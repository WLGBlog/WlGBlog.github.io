var config = {
  apiKey: "AIzaSyCgaWDWyS0NeGkBNN0txgFkIuLf5Svscp0",
  authDomain: "chores-55c47.firebaseapp.com",
  databaseURL: "https://chores-55c47.firebaseio.com",
  projectId: "chores-55c47",
  storageBucket: "",
  messagingSenderId: "1035431364371"
};
firebase.initializeApp(config);

var user;

const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('loginBtn');
const btnLogout = document.getElementById('btnLogout');

var db = firebase.firestore();
var usersRef = db.collection("users");
var userRole;


btnLogin.addEventListener('click', e => {
    e.preventDefault();
    
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => alert(e.message));

    
});

btnLogout.addEventListener('click', e => {
    e.preventDefault();
    firebase.auth().signOut();
}); 

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      user=firebaseUser;
      usersRef = db.doc('users/'+user.uid);
      $('#login').hide();
      $('#app').show();
      load();
    } else {
      $('#app').hide();
      $('#login').show();
    }
});


function load(){
  getUserRole();
  insertChores();
  displayChoresList();
}

function insertChores() {
  db.collection("chores").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        var kids = document.getElementById('kids');
        kids.innerHTML += "<button id='"+doc.id+"' class='btn btn-primary' onclick='"+doc.id+"(this)'>"+doc.data().type+"</button>"
    });
  });
}

var NYKF3bCrO1xqeRKk3ZWr_Count;
db.doc("chores/NYKF3bCrO1xqeRKk3ZWr").onSnapshot(function(doc){
    NYKF3bCrO1xqeRKk3ZWr_Count = doc.data().count;
});

var p5VhgTEXP5R1fGKJaZLC_Count;
db.doc("chores/p5VhgTEXP5R1fGKJaZLC").onSnapshot(function(doc){
    p5VhgTEXP5R1fGKJaZLC_Count = doc.data().count;
});

var u45qDMyJjjuEvVOxf8Xa_Count;
db.doc("chores/u45qDMyJjjuEvVOxf8Xa").onSnapshot(function(doc){
    u45qDMyJjjuEvVOxf8Xa_Count = doc.data().count;
});

function displayChoresList() {
  db.collection("chores").onSnapshot(function(querySnapshot) {
    var parents = document.getElementById('parents');
    parents.innerHTML="";
    querySnapshot.forEach(function(doc) {
        var parents = document.getElementById('parents');
        parents.innerHTML += "<li class='list-group-item'>"+doc.data().type+": "+doc.data().count+"</li>"
    });
  });
}

function u45qDMyJjjuEvVOxf8Xa(elmnt) {
  var html = elmnt.innerHTML;
  db.doc("chores/"+elmnt.id).set({
    type: html,
    count: u45qDMyJjjuEvVOxf8Xa_Count+1
  });
}

function p5VhgTEXP5R1fGKJaZLC(elmnt) {
  var html = elmnt.innerHTML;
  db.doc("chores/"+elmnt.id).set({
    type: html,
    count: p5VhgTEXP5R1fGKJaZLC_Count+1
  });
}


function NYKF3bCrO1xqeRKk3ZWr(elmnt) {
  var html = elmnt.innerHTML;
  db.doc("chores/"+elmnt.id).set({
    type: html,
    count: NYKF3bCrO1xqeRKk3ZWr_Count+1
  });
}


function getUserRole(){
  usersRef.get().then(function(doc){
    if(doc.data().role == "kid"){
      $('#kids').show();
      $('#parents').hide();
    } else if(doc.data().role == "parents"){
      $('#kids').hide();
      $('#parents').show();
    }
  });
  return;
}
