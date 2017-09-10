// Initialize Firebase
var config = {
    apiKey: "AIzaSyBMXjpeWu-UF2BjU39EET6fVCLIJachnjc",
    authDomain: "learning-e1514.firebaseapp.com",
    databaseURL: "https://learning-e1514.firebaseio.com",
    projectId: "learning-e1514",
    storageBucket: "learning-e1514.appspot.com",
    messagingSenderId: "1005462796702"
  };
  firebase.initializeApp(config);

const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');

var ref = firebase.database().ref('messages');

btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));

    
});

btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        btnLogout.classList.remove('hide');
        document.getElementById('form').classList.add('hide');
        document.getElementById('messagesTitle').classList.remove('hide');        
        displayMessages();
    } else {
        btnLogout.classList.add('hide');
        document.getElementById('messagesTitle').classList.add('hide');
    }
});

window.onbeforeunload = function (e) {
    var e = e || window.event;
  
    if (e) {
      firebase.auth().signOut();
    }
  
    return firebase.auth().signOut();;
  };
  
function displayMessages() {
    ref.on('value', gotData, errData);
} 

function gotData(data) {
    var messages = data.val();
    var keys = Object.keys(messages);
    var messageList = document.getElementById('messageList');    
    messageList.innerHTML = "";
    for (var i=0; i<keys.length; i++){
        var k = keys[i];
        var email = messages[k].email;
        var message = messages[k].message;
        messageList.innerHTML += "<li>"+email+": "+message+"</li>"
    }
}

function errData(err) {
    console.log('Error!');
    console.log(err);
}
