var gameProps = {
    gameWidth: 600,
    gameHeight: 500,

    b_vel: 1000,

    nextFire: 0,
    fireRate: 200,

    turret_x: 100,

    spawn_rate: 4000,
    next_spawn: 0,
};
var labels = {
    instructions: "You were overcome by potatoes!\n\n\n- click to play again -",
};
var fontAssets = {
    instructionsFontStyle:{font: '24px Arial', fill: '#000000', align: 'center'},        
};

var bullet;
var self;

var mainState = function(game){
    this.base;
    this.barrel;
    this.bullet;
    this.enemy;
    this.enemyGroup;
    this.instructions;
}
mainState.prototype = {
    preload: function () {
        game.load.image('base', 'base.png');
        game.load.image('barrel', 'barrel.png');
        game.load.image('bullet', 'bullet.png');
        game.load.image('enemy', 'enemy.png');        
    },

    create: function () {
        // Setup
        game.stage.backgroundColor = "#80ff80";
        game.physics.startSystem(Phaser.Physics.ARCADE, Phaser.AUTO);
        // Base
        this.base = game.add.sprite(gameProps.turret_x, game.world.centerY, 'base');
        this.base.anchor.setTo(0.5);
        this.base.scale.setTo(0.15);
        // Bullets
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(50, 'bullet');
        this.bullets.setAll('anchor.y',0.5);
        this.bullets.setAll('scale.x',0.1);
        this.bullets.setAll('scale.y',0.12);
        this.bullets.setAll('checkWorldBounds',true);
        this.bullets.setAll('outOfBoundsKill',true);        
        // Barrel
        this.barrel = game.add.sprite(gameProps.turret_x, game.world.centerY, 'barrel');
        this.barrel.anchor.setTo(0.5);
        this.barrel.scale.setTo(0.15);
        // Enemy Group
        this.enemyGroup = game.add.group();
        this.enemyGroup.enableBody = true;
        this.enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

        self = this;

        self.createEnemies();

        // Instructions
        this.instructions = game.add.text(game.world.centerX,game.world.centerY, labels.instructions, fontAssets.instructionsFontStyle);
        this.instructions.anchor.setTo(0.5);
        this.instructions.visible = false;
    },

    update: function () {
        // Barrel Rotation
        this.barrel.rotation = game.physics.arcade.angleToPointer(this.barrel);
        if(game.input.activePointer.isDown) {
            this.fire();
        }
        // Hit Enemy
        game.physics.arcade.overlap(this.enemyGroup, this.bullets, this.hitGroup);      
        game.physics.arcade.overlap(this.enemyGroup, this.bullets, this.hitGroup);     
        // Enemy Pass
        this.enemyGroup.forEachAlive(function(e){
            if (e.body.x < gameProps.turret_x) {
                self.gameOver();
            }   
        });      
        // Spawn new waves
        if(game.time.now > gameProps.next_spawn) {
            gameProps.next_spawn = game.time.now + gameProps.spawn_rate;
            self.createEnemies();
            if(gameProps.spawn_rate > 50)
                gameProps.spawn_rate = gameProps.spawn_rate*0.95;
        }
    },
    fire: function() {
        if (game.time.now > gameProps.nextFire) {
            gameProps.nextFire = game.time.now + gameProps.fireRate;
            bullet = this.bullets.getFirstDead();
            bullet.reset(this.barrel.x, this.barrel.y);
    
            game.physics.arcade.moveToPointer(bullet, gameProps.b_vel);
            bullet.rotation = game.physics.arcade.angleToPointer(bullet);    
        }
    },

    hitGroup: function(e) {
        e.kill()
        bullet.kill();
    },

    gameOver: function () {
        this.instructions.visible = true;
        game.input.onDown.add(this.restart, this);        
    },
    createEnemies: function () {
        for(var i=0; i<3; i++) {
            this.enemyGroup.create(500,200 * i +50, 'enemy');
        }
        this.enemyGroup.setAll('anchor.x', 0.5);
        this.enemyGroup.setAll('anchor.y', 0.5);
        this.enemyGroup.setAll('scale.x', 0.25);
        this.enemyGroup.setAll('scale.y', 0.25);
        this.enemyGroup.setAll('body.velocity.x', -40);
    },
    restart: function() {
        gameProps.spawn_rate = 4000;
        gameProps.next_spawn = 0;
        game.state.start('main');
    },
};

var game = new Phaser.Game(gameProps.gameWidth, gameProps.gameHeight);

game.state.add('main', mainState);
game.state.start('main');