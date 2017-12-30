function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var gameProps = {
    gameWidth: 450,
    gameHeight: 525,

    brickCount_x: 6,
    brickCount_y: 5,

    paddleSegmentAngle: 15,
    paddleSegmentsMax: 8,
    paddleSegmentHeight: 8,
    paddleVelocity: 400,

    ballVelocity: 400,

    mode: -1,
};
var labels = {
    win_instructions: "You Won!\n-click to restart-",
    lose_instructions: "You Lost!\n-click to restart-",    
};
var fontAssets = {
    instructionsFontStyle:{font: '24px Arial', fill: '#FFFFFF', align: 'center'},        
};
var mainState = {
    preload: function () {
        game.load.image('paddle', 'paddle.png');
        game.load.image('brick', 'brick.png');
        game.load.image('ball', 'ball.png');        
    },

    create: function () {
        // Setup
        game.stage.backgroundColor = '#3598db';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true;
        // Instructions
        this.win_instructions = game.add.text(game.world.centerX, game.world.centerY+20, labels.win_instructions, fontAssets.instructionsFontStyle);
        this.win_instructions.anchor.set(0.5, 0.5);
        this.lose_instructions = game.add.text(game.world.centerX, game.world.centerY+20, labels.lose_instructions, fontAssets.instructionsFontStyle);
        this.lose_instructions.anchor.set(0.5, 0.5);
        this.hideText();
        // Paddle
        this.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.paddle = game.add.sprite(gameProps.gameWidth/2,gameProps.gameHeight-50,'paddle');
        this.paddle.anchor.setTo(0.5);
        this.paddle.body.collideWorldBounds = true;
        this.paddle.body.immovable = true;        
        // Bricks
        this.bricks = game.add.group();
        for (var i = 0; i<gameProps.brickCount_x; i++) {
            for (var j = 0; j<gameProps.brickCount_y; j++) {
                var brick = game.add.sprite(55+i*60, 55+j*35, 'brick');
                brick.body.immovable = true;
                this.bricks.add(brick);
            }
        }
        // Ball
        this.ball = game.add.sprite(gameProps.gameWidth/2,250,'ball');
        this.ball.anchor.setTo(0.5);
        this.ball.body.velocity.x = getRandomInt(-300,300);
        this.ball.body.velocity.y = getRandomInt(100,200);
        this.ball.body.bounce.setTo(1);
        this.ball.body.collideWorldBounds = true;
    },

    update: function () {
        // Paddle
        if(this.left.isDown) this.paddle.body.velocity.x = -gameProps.paddleVelocity;
        else if(this.right.isDown) this.paddle.body.velocity.x = gameProps.paddleVelocity;        
        else this.paddle.body.velocity.x = 0;

        // Collisions
        game.physics.arcade.overlap(this.ball, this.paddle, this.collideWithPaddle, null, this);                
        game.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this);
        if (this.ball.y > this.paddle.y && gameProps.mode!=1)
            this.lose();
        else if (this.bricks.total==0  && gameProps.mode!=2){
            this.win();
        }
    },

    hit: function (ball, brick) {
        brick.kill();
    },
    collideWithPaddle: function (ball, paddle) {
        var returnAngle;
        var segmentHit = Math.floor((ball.y - paddle.y)/gameProps.paddleSegmentHeight);
        
        if (segmentHit >= gameProps.paddleSegmentsMax) {
            segmentHit = gameProps.paddleSegmentsMax - 1;
        } else if (segmentHit <= -gameProps.paddleSegmentsMax) {
            segmentHit = -(gameProps.paddleSegmentsMax - 1);
        }
        
        if (paddle.x < gameProps.gameWidth * 0.5) {
            returnAngle = segmentHit * gameProps.paddleSegmentAngle;
            game.physics.arcade.velocityFromAngle(returnAngle, gameProps.ballVelocity, this.ball.body.velocity);
        } else {
            returnAngle = 180 - (segmentHit * gameProps.paddleSegmentAngle);
            if (returnAngle > 180) {
                returnAngle -= 360;
            }
            
            game.physics.arcade.velocityFromAngle(returnAngle, gameProps.ballVelocity, this.ball.body.velocity);
        }
    },
    win: function () {
        gameProps.mode=1;
        this.win_instructions.visible = true;
        this.enablePaddle(false);
        game.input.onDown.add(this.restart, this);
    },
    hideText: function () {
        this.win_instructions.visible = false;
        this.lose_instructions.visible = false;
    },
    lose: function () {
        gameProps.mode=2;
        this.lose_instructions.visible = true;
        this.enablePaddle(false);        
        game.input.onDown.add(this.restart, this);        
    },
    enablePaddle: function (enabled) {
        this.paddle.visible = enabled;
        this.paddle.body.enabled = enabled;
    },
    restart: function () {
        gameProps.mode=0;
        game.state.start('main');
    }
};

var game = new Phaser.Game(gameProps.gameWidth, gameProps.gameHeight);
game.state.add('main', mainState);
game.state.start('main');