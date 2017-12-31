// Initialize Firebase
var config = {
    apiKey: "AIzaSyC1i-8nrAyF-B1ejRqNhyIQayIu8WpbzM4",
    authDomain: "multiplayer-tic-tac-toe.firebaseapp.com",
    databaseURL: "https://multiplayer-tic-tac-toe.firebaseio.com",
    projectId: "multiplayer-tic-tac-toe",
    storageBucket: "multiplayer-tic-tac-toe.appspot.com",
    messagingSenderId: "986578979154"
};
firebase.initializeApp(config);

let db = firebase.firestore();

let btn1 = document.getElementsByClassName('btn-1')[0];
let btn2 = document.getElementsByClassName('btn-2')[0];
let btn3 = document.getElementsByClassName('btn-3')[0];
let btn4 = document.getElementsByClassName('btn-4')[0];
let btn5 = document.getElementsByClassName('btn-5')[0];
let btn6 = document.getElementsByClassName('btn-6')[0];
let btn7 = document.getElementsByClassName('btn-7')[0];
let btn8 = document.getElementsByClassName('btn-8')[0];
let btn9 = document.getElementsByClassName('btn-9')[0];

let btns = [btn1, btn2, btn3, btn4, btn5, btn6, btn7, btn8, btn9];
var turn = 0;
var player_won = -1;
var player;
var current_game;
var total_games=0;

var pos = [-1,-1,-1,-1,-1,-1,-1,-1,-1];

let username;
var roomId;

var game;

if(localStorage.getItem("username") !== null){
    document.getElementById('usernameInp').value = localStorage.getItem("username");
}

function Game(roomId, player, total_games) {
    // Load Buttons From Array 'pos'
    // 1 = o 0 = x

    this.id = roomId;
    this.player = player;
    this.total_games = total_games;
    this.current_game = current_game;
    this.p1_score;
    this.p2_score;
    
    if(this.total_games>1) {
        this.p1_score=0;
        this.p2_score=0;
    }

    this.update = function() {
        for (var i=0; i<9; i++) {
            if (pos[i]== 1) {
                btns[i].classList.remove('ttt-btn');
                btns[i].classList.add('ttt-btn-o');
                btns[i].innerHTML = 'O';
            } else if (pos[i] == 0){
                btns[i].classList.remove('ttt-btn');
                btns[i].classList.add('ttt-btn-x');
                btns[i].innerHTML = 'X';
            }
        }
    }

    this.checkForWin = function () {
        if(pos[0]==0 && pos[1]==0 && pos[2]==0){
            player_won=0;
        } else if(pos[0]==1 && pos[1]==1 && pos[2]==1){
            player_won=1;
        } else if(pos[3]==0 && pos[4]==0 && pos[5]==0){
            player_won=0;
        }  else if(pos[3]==1 && pos[4]==1 && pos[5]==1){
            player_won=1;
        } else if(pos[6]==0 && pos[7]==0 && pos[8]==0){
            player_won=0;
        } else if(pos[6]==1 && pos[7]==1 && pos[8]==1){
            player_won=1;
        } else if(pos[0]==0 && pos[3]==0 && pos[6]==0){
            player_won=0;
        } else if(pos[0]==1 && pos[3]==1 && pos[6]==1){
            player_won=1;
        } else if(pos[1]==0 && pos[4]==0 && pos[7]==0){
            player_won=0;
        } else if(pos[1]==1 && pos[4]==1 && pos[7]==1){
            player_won=1;
        } else if(pos[2]==0 && pos[5]==0 && pos[8]==0){
            player_won=0;
        } else if(pos[2]==1 && pos[5]==1 && pos[8]==1){
            player_won=1;
        } else if(pos[0]==0 && pos[4]==0 && pos[8]==0){
            player_won=0;
        } else if(pos[0]==1 && pos[4]==1 && pos[8]==1){
            player_won=1;
        } else if(pos[2]==0 && pos[4]==0 && pos[6]==0){
            player_won=0;
        } else if(pos[2]==1 && pos[4]==1 && pos[6]==1){
            player_won=1;
        }

        if (player_won==this.player && player_won!=-1 && (total_games==3 || total_games==5)) {
            if(this.player == 0){
                this.p1_score+=1;
            } else if(this.player == 1){
                this.p2_score+=1;
            }
            this.current_game+=1;
            this.player_won = -1;
            pos=[-1,-1,-1,-1,-1,-1,-1,-1,-1];
            this.update();            
            updateDB(pos,turn,this.current_game,this.p1_score,this.p2_score);
            //document.getElementById('result').innerHTML="You Won!";
            //quitRoom(this.id);
        } else if(player_won!=-1 && ((this.total_games==3 && this.current_game==3)|| (this.total_games==5 && this.current_game==5))) {
            if(p1_score>p2_score){
                if(this.player == 0){
                    document.getElementById('result').innerHTML="You Won!";
                    quitRoom(this.id);
                } else if(this.player == 1) {
                    document.getElementById('result').innerHTML="You Lost!";
                    quitRoom(this.id);
                }
            } else if(p1_score<p2_score){
                if(this.player == 1){
                    document.getElementById('result').innerHTML="You Won!";
                    quitRoom(this.id);
                } else if(this.player == 0) {
                    document.getElementById('result').innerHTML="You Lost!";
                    quitRoom(this.id);
                }
            }
        }

        if (player_won==this.player && player_won!=-1 && this.total_games==1) {
            document.getElementById('result').innerHTML="You Won!";
            quitRoom(this.id);
        } else if(player_won!=-1 && this.total_games==1) {
            document.getElementById('result').innerHTML="You Lost!";
            quitRoom(this.id);
        } else if (player_won==-1 && turn==9 && this.total_games==1){
            document.getElementById('result').innerHTML="It's a tie!";
            quitRoom(this.id);
        }
    }
    this.pure_update = function() {
        for (var i=0; i<9; i++) {
            if (pos[i]== 1) {
                btns[i].classList.remove('ttt-btn');
                btns[i].classList.add('ttt-btn-o');
                btns[i].innerHTML = 'O';
            } else if (pos[i] == 0){
                btns[i].classList.remove('ttt-btn');
                btns[i].classList.add('ttt-btn-x');
                btns[i].innerHTML = 'X';
            }
        }
    }
    this.restart = function () {
        pos = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
        for (var i=0; i<9; i++) {
            btns[i].classList.remove('ttt-btn-o');
            btns[i].classList.remove('ttt-btn-x');
            btns[i].classList.add('ttt-btn');
            btns[i].innerHTML = '+';
        }
    }
}

function start(total_games) {
    var returning_user = false;

    total_games=total_games;
    
    username = document.getElementById('usernameInp').value;

    if(username="") {
        username = "Guest";
    } 

    document.getElementById('chooseGame').style.display="none";


    let usersRef = db.collection("users");
    let query = usersRef.where("username","==",username).get().then(function(snap){
        if(snap.docs[0]){
            findRoom(total_games);
        } else {
            localStorage.setItem("username", username);        
            usersRef.add({
                username: username,
                wins: 0
            });
            findRoom(total_games);
        }
    });
    /*if(!returning_user) {
        localStorage.setItem("username", username);        
        usersRef.add({
            username: username,
            wins: 0
        });
    }
    findRoom();  */  
}

//let game = new Game();

function findRoom(total_games) {
    let roomsRef = db.collection("rooms");
    let query = roomsRef.where("filled","==",false).where("total_games","==",total_games).get().then(function(snap){
        if(snap.docs[0]){
            roomId = snap.docs[0].id;
            roomsRef.doc(roomId).update({
                filled: true,
                user2: username
            });
            //quitRoom(roomId);
            startGame(roomId, 1, total_games);
            return;
        } else {
            let newRef = db.collection("rooms").doc();
            let id = newRef.id;
            newRef.set({
                filled: false,
                user1: username,
                pos: [-1,-1,-1,-1,-1,-1,-1,-1,-1],
                turn: 0,
                player_won: -1,
                total_games: total_games,
                current_game: 0,
                p1_score: 0,
                p2_score: 0
            });
            waitForGame(id, total_games);
            roomId = id;
        }
    });
}

function quitRoom(roomId){
    let loader = document.getElementById('waitGame');
    loader.style.display = "none";
    let join = document.getElementById('join');
    join.style.display = "block";
    let gameDiv = document.getElementById('game');
    gameDiv.style.display = "none";
    document.getElementById('chooseGame').style.display="block";
    

    var ref = db.collection('rooms').doc(game.id);
    let query = ref.get().then(function(doc){
        if(doc.exists && doc.data().user1 && doc.data().user2){
            if(doc.data().user1==username){
                ref.update({
                    user1: firebase.firestore.FieldValue.delete()
                });
            } else if(doc.data().user2==username){
                ref.update({
                    user2: firebase.firestore.FieldValue.delete()
                });
            }
            
        } else {
            ref.delete();
        }
    });
}

function waitForGame(roomId, total_games) {
    // Show loading screen
    let loader = document.getElementById('waitGame');
    loader.style.display = "block";
    // when another user joins start game
    var ref = db.collection('rooms').doc(roomId);
    ref.onSnapshot(function(doc){
        if(doc.data().user2 && doc.exists){
            startGame(roomId, 0, total_games);
        }
    });
}

function startGame(roomId, player, total_games) {
    let loader = document.getElementById('waitGame');
    loader.style.display = "none";
    let join = document.getElementById('join');
    join.style.display = "none";

    game = new Game(roomId, player, total_games);
    player = player;

    let gameDiv = document.getElementById('game');
    gameDiv.style.display = "block";

    let ref = db.collection("rooms").doc(roomId);
    ref.onSnapshot(function(doc){
        if(doc.exists){
            pos = doc.data().pos;
            turn = doc.data().turn;
            player_won = doc.data().player_won;
            game.current_game = doc.data().current_game;
            game.p1_score = doc.data().p1_score;
            game.p2_score = doc.data().p2_score;
            game.update();
            game.checkForWin();
        }
        
    });
}

function clicked(num) {
    if (turn%2==0 && btns[num].classList.contains('ttt-btn') && game.player==0) {
        pos[num] = 0;
        turn+=1;        
    } else if (turn%2!=0 && btns[num].classList.contains('ttt-btn') && game.player==1) {
        pos[num] = 1;
        turn+=1;        
    }
    game.checkForWin();    
    game.update();        
    updateDB(pos,turn,game.current_game,game.p1_score,game.p2_score);
}

function updateDB(pos,turn,current_game,p1_score,p2_score) {
    db.collection("rooms").doc(roomId).update({
        pos: pos,
        turn: turn,
        current_game: current_game,
        p1_score: p1_score,
        p2_score: p2_score
    });  
}