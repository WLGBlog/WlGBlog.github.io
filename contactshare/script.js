var config = {
    apiKey: "AIzaSyDfGioT2doHmP84RysZxEG0hLW-DWGsZak",
    authDomain: "share-my-contact.firebaseapp.com",
    databaseURL: "https://share-my-contact.firebaseio.com",
    projectId: "share-my-contact",
    storageBucket: "",
    messagingSenderId: "407676123518"
};
firebase.initializeApp(config);

var db = firebase.firestore();

db.collection("users").get = function() {
  return;
};

db.get = function() {
  return;
};

db.delete = function() {
  return;
}

let user = {
  setData: function(id,email,name,code,phone) {
    this.email = email;
    this.localName = name;
    this.code = code;
    this.phone = phone;
    this.db_id = id;
  },
};
let setData = user.setData;

$('#signupBtn').click(function(){
  $('#signupDiv').show();
  $('#signupBtn').hide();
  $('#loginDashboard').hide();
  $('#signupDashboard').hide();
  $('#loginBtn').show();
  $('#backBtn').show();
  $('#backBtn').addClass('float-left');
  $('#backBtn').removeClass('float-right');
  document.getElementById('backBtn').classList.remove('float-right');
  $('#loginDiv').hide();
  $('#codeDiv').hide();
});

$('#loginBtn').click(function(){
  if(user.user) {
    user.newUser = false;
    $('#loginDashboard').show();
    displayDetails();
    $('#signupDashboard').hide();
    $('#signupBtn').show();
    $('#backBtn').show();
    $('#backBtn').addClass('float-right');
  $('#backBtn').removeClass('float-left');
    $('#loginBtn').hide();
    document.getElementById('backBtn').classList.add('float-right');
    $('#signupDiv').hide();
    $('#codeDiv').hide();
    return;
  }
  $('#loginDiv').show();
  $('#loginBtn').hide();
  $('#loginDashboard').hide();
  $('#signupDashboard').hide();
  $('#signupBtn').show();
  $('#backBtn').show();
  document.getElementById('backBtn').classList.add('float-right');
  $('#signupDiv').hide();
  $('#codeDiv').hide();
});

$('#backBtn').click(function(){
  $('#loginBtn').show();
  $('#loginDashboard').hide();
  $('#signupDashboard').hide();
  $('#signupBtn').show();
  $('#backBtn').hide();
  $('#signupDiv').hide();
  $('#loginDiv').hide();
  $('#codeDiv').show();
});

// Sign Up User 
$('#signupUserBtn').click(function(){
  var email = document.getElementById("signupEmailInp").value;
  var pass = document.getElementById("signupPassInp").value;
  const auth = firebase.auth();
  
  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch(e => {
    $('#signupAlert').show();
    $('#signupAlert').text(e.message);
    setTimeout(hideSignupAlert,3000);
  });
  
  user.newUser = true;
});


// Login User
$('#loginUserBtn').click(function(){
  var email = document.getElementById("loginEmailInp").value;
  var pass = document.getElementById("loginPassInp").value;
  const auth = firebase.auth();
  
  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(e => {
    //e.message
    $('#loginAlert').show();
    $('#loginAlert').text(e.message);
    setTimeout(hideLoginAlert,3000);
  });
  
  user.newUser = false;
});

function hideLoginAlert() {
  $('#loginAlert').fadeOut(1000);
}

function hideSignupAlert() {
  $('#signupAlert').fadeOut(1000);
}

// On Auth State Changed
firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser) {
    user.user = firebaseUser;
    
    if(user.newUser) {
      $('#signupDiv').hide();
      $('#signupDashboard').show();
    } else if(!user.newUser) {
      $('#loginDashboard').show();
      displayDetails();
    }
  }
  else {
    
  }
});



function save(elmnt) {
  let newCode = $('#loginCodeDisplay').val();
  db.collection("users").where("code", "==", newCode).get().then(snap=>{
    for(let i = 0; i< snap.docs.length; i++) {
      if(user.uid != snap.docs[i].data().uid){
        snap.docs.splice(i,1);
      }
    }
    if(snap.docs.length > 0){
      $('#dashErrorAlert').show();
      setTimeout(function(){
        $('#dashErrorAlert').fadeOut();
      }, 3000);
    } else {
      let newLocalName = $('#loginNameDisplay').val();
      let newEmail = $('#loginEmailDisplay').val();
      let newPhone = $('#loginPhoneDisplay').val();
      db.collection("users").doc(elmnt.id).update({
        code: (newCode!==""?newCode:user.code),
        name: (newLocalName!==""?newLocalName:user.localName),
        email: (newEmail!==""?newEmail:user.email),
        phone: (newPhone!==""?newPhone:user.phone),
      });
    }

  });
}

function displayDetails() {
  $('#loginDiv').hide();
  $('#signupDiv').hide();
  db.collection("users").where("uid", "==", user.user.uid).get().then(function(snap){
    $('#loginCodeDisplay').val(snap.docs[0].data().code);
    $('#loginNameDisplay').val(snap.docs[0].data().name);
    $('#loginEmailDisplay').val(snap.docs[0].data().email);
    $('#loginPhoneDisplay').val(snap.docs[0].data().phone);
    document.getElementById('saveBtn').id = snap.docs[0].id;
    user.code = snap.docs[0].data().code;
    user.localName = snap.docs[0].data().name;
    user.email = snap.docs[0].data().email;
    user.phone = snap.docs[0].data().phone;
  });
}

window.addEventListener("beforeunload",function(){
  firebase.auth().signOut();
  
  return null;
});

$('#userDetails').submit(e=>{
  e.preventDefault();
  let uid = user.user.uid;
  let code = $('#signupCodeDisplay').val();
  db.collection("users").where("code", "==", code).get().then(snap=>{
    for(let i = 0; i< snap.docs.length; i++) {
      if(user.uid != snap.docs[i].data().uid){
        snap.docs.splice(i,1);
      }
    }
    if(snap.docs.length > 0){
       $('#signupErrorAlert').show();
      setTimeout(function(){
        $('#signupErrorAlert').fadeOut();
      }, 3000);
    } else {
      let name = $('#signupNameDisplay').val();
      let email = $('#signupEmailDisplay').val();
      let phone = $('#signupPhoneDisplay').val();
      
      db.collection("users").add({
        uid: uid,
        code: code,
        name: name,
        email: email,
        phone: phone
      }).then(function(docRef){
          user.db_id = docRef.id;
      });
      
      $('#loginDashboard').show();
      displayDetails();
      $('#signupDashboard').hide();
      $('#signupDiv').hide();
    }

  });
  
});

function findContact() {
  let code = $('#codeInput').val();
  db.collection("users").where("code","==",code).get().then(function(snap){
    if (snap && snap.docs && snap.docs.length > 0) {
      $('#infoDiv').show();
      $('#nameTxt').html((snap.docs[0].data().name?"<strong>Name: </strong><span class='name'>"+snap.docs[0].data().name+"</span> <a href='#' onclick='copyName()'>&#128203;</a>": ""));
      $('#emailTxt').html((snap.docs[0].data().email?"<strong>Email: </strong><span class='email'>"+snap.docs[0].data().email+"</span> <a href='#' onclick='copyEmail()'>&#128203;</a>": ""));
      $('#phoneTxt').html((snap.docs[0].data().phone?"<strong>Phone Number: </strong><span class='phone'>"+snap.docs[0].data().phone+"</span> <a href='#' onclick='copyPhone()'>&#128203;</a>": ""));
    } else {
      $('#codeAlert').show();
      $('#codeAlert').text("There is no user with that code");
      setTimeout(hideCodeAlert,3000);
    }
  });
}

function hideCodeAlert() {
  $('#codeAlert').fadeOut(1000);
}

function hideAlert() {
  $('#copiedAlert').fadeOut(1000);
}

function copyName() {
  $('#copiedAlert').show();
  setTimeout(hideAlert, 3000);
  var copyText = document.getElementsByClassName("name");
  copyToClipboard(copyText[0]);
}

function copyEmail() {
  $('#copiedAlert').show();
  setTimeout(hideAlert, 3000);
  var copyText = document.getElementsByClassName("email");
  copyToClipboard(copyText[0]);
}

function copyPhone() {
  $('#copiedAlert').show();
  setTimeout(hideAlert, 3000);
  var copyText = document.getElementsByClassName("phone");
  copyToClipboard(copyText[0]);
}



function copyToClipboard(elem) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

