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

// Reference Messages
var messagesRef = firebase.database().ref('messages');


document.getElementById('form-contact').addEventListener('submit', submitForm);

function submitForm(e) {
  e.preventDefault();
  
  var email = getInputVal('email');
  var message = getInputVal('message');

  saveMessage(email, message);

  document.querySelector('.alert').style.display='block';

  setTimeout(function(){
    document.querySelector('.alert').style.display='none';
    location.reload();
  }, 3000);

  
  
}

function getInputVal(id){
  return document.getElementById(id).value;
}

function saveMessage(email, message){
  var newMessageRef = messagesRef.push();
  newMessageRef.set({
    email: email,
    message: message
  });
}
