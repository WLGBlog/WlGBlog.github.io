var mainState = {
    preload: function() { 
        game.load.image('bird','assets/bird.png');
        game.load.image('pipe','assets/pipe.png');
    },

    create: function() { 
        game.stage.backgroundColor = "#71c5cf";
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.bird = game.add.sprite(100,245,'bird');
        this.pipes = game.add.group();

        game.physics.arcade.enable(this.bird);

        this.bird.body.gravity.y = 1000;

        let spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 

        this.score = 0;
        this.labelScore = game.add.text(20,20,"0",{font:"30px Arial",fill: "#ffffff"});
    },

    update: function() {
        if (this.bird.y<0 || this.bird.y>490) {
            this.restartGame();
        }

        game.physics.arcade.overlap(this.bird,this.pipes,this.restartGame,null,this);
    },

    jump: function() {
        this.bird.body.velocity.y = -350;
    },
    
    restartGame: function() {
        game.state.start('main');
    },

    addOnePipe: function(x,y) {
        let pipe = game.add.sprite(x,y,'pipe');
        
        this.pipes.add(pipe);

        game.physics.arcade.enable(pipe);

        pipe.body.velocity.x = -200;

        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        let hole = Math.floor(Math.random() *5) +1;
        for(let i=0;i<8;i++) {
            if(i!=hole && i!=hole+1) {
                 this.addOnePipe(400,i*60+10);
            }
        }
        this.score+=1;
        this.labelScore.text = this.score;
    },
};

var game = new Phaser.Game(400, 490);
game.state.add('main', mainState); 
game.state.start('main');