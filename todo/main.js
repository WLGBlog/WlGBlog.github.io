var config = {
  apiKey: "AIzaSyBIV0dPpIwuZadvGfmkIPF7gsykIvt8n4M",
  authDomain: "to-do-332c9.firebaseapp.com",
  databaseURL: "https://to-do-332c9.firebaseio.com",
  projectId: "to-do-332c9",
  storageBucket: "to-do-332c9.appspot.com",
  messagingSenderId: "281739919235"
};
firebase.initializeApp(config);

const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignup = document.getElementById('btnSignup');
const btnLogout = document.getElementById('btnLogout');
const addTodo = document.getElementById('addTodo');

var todoRef;
var user;

btnLogin.addEventListener('click', e => {  
  document.getElementById('form').classList.add('hide');    

  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();

  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));
  
});

btnSignup.addEventListener('click', e => {
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();

  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));

});

btnLogout.addEventListener('click', e => {
  firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    btnLogout.classList.remove('hide');
    document.getElementById('form').classList.add('hide');
    document.getElementById('todo').classList.remove('hide');
    todoRef = firebase.database().ref(firebaseUser.uid);
    user = firebaseUser.uid;
    displayTodos();
  } else {
    btnLogout.classList.add('hide');
    document.getElementById('todo').classList.add('hide');
  }
});

addTodo.addEventListener('click', () => {
  var todo = document.getElementById('todoInput').value;
  saveTodo(todo);
});


function saveTodo(todo){
  var newTodoRef = todoRef.push();
  newTodoRef.set({
    todo: todo
  });
} 

function displayTodos() {
  todoRef.on('value', gotData, errData);
} 

var k;
var keys;
var todoList;
var todos;

function gotData(data) {
  todos = data.val();
  keys = Object.keys(todos);
  todoList = document.getElementById('todoList');  
  if (keys.length > 0){
    todoList.innerHTML = "";
    for (var i=0; i<keys.length; i++){
      k = keys[i];
      var todo = todos[k].todo;
      todoList.innerHTML += "<li id='"+keys[i]+"'>"+todo+"<button id="+keys[i]+" class='close' style='margin-left='50px' onclick='die(this)'>X</button></li>";
      
    }
  } else {
    todoList.innerHTML = "";
  }
}

function errData(err) {
  console.log('Error!');
  console.log(err);
}

function die(elmnt) {
  var id = elmnt.id;
  del(id);
  keys = Object.keys(todos);
  if(keys.length == 0){
    location.reload();
  }
}

function del(id){
  firebase.database().ref(user+'/'+id).remove();
}
