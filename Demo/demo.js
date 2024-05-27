var assetsFolder = 'https://digital-brilliance-hour.github.io/phaser-shooter-base/';

//boot object
var BasicGame = {
  SEA_SCROLL_SPEED: 12,
  PLAYER_SPEED: 300,
  ENEMY_MIN_Y_VELOCITY: 30,
  ENEMY_MAX_Y_VELOCITY: 60,
  SHOOTER_MIN_VELOCITY: 30,
  SHOOTER_MAX_VELOCITY: 80,
  BOSS_Y_VELOCITY: 15,
  BOSS_X_VELOCITY: 200,
  BULLET_VELOCITY: 500,
  ENEMY_BULLET_VELOCITY: 150,
  POWERUP_VELOCITY: 100,

  SPAWN_ENEMY_DELAY: Phaser.Timer.SECOND,
  SPAWN_SHOOTER_DELAY: Phaser.Timer.SECOND * 3,

  SHOT_DELAY: Phaser.Timer.SECOND * 0.1,
  SHOOTER_SHOT_DELAY: Phaser.Timer.SECOND * 2,
  BOSS_SHOT_DELAY: Phaser.Timer.SECOND,

  ENEMY_HEALTH: 2,
  SHOOTER_HEALTH: 5,
  BOSS_HEALTH: 500,

  BULLET_DAMAGE: 1,
  CRASH_DAMAGE: 5,

  ENEMY_REWARD: 100,
  SHOOTER_REWARD: 400,
  BOSS_REWARD: 10000,
  POWERUP_REWARD: 100,

  ENEMY_DROP_RATE: 0.3,
  SHOOTER_DROP_RATE: 0.5,
  BOSS_DROP_RATE: 0,

  PLAYER_EXTRA_LIVES: 3,
  PLAYER_GHOST_TIME: Phaser.Timer.SECOND * 3,

  INSTRUCTION_EXPIRE: Phaser.Timer.SECOND * 10,
  RETURN_MESSAGE_DELAY: Phaser.Timer.SECOND * 2
};

BasicGame.Boot = function(game) {

};

BasicGame.Boot.prototype = {

  init: function() {

    //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
    this.input.maxPointers = 1;

    //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
    // this.stage.disableVisibilityChange = true;

    if (this.game.device.desktop) {
      //  If you have any desktop specific settings, they can go in here
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      //this.scale.setMinMax(480, 260, 1024, 768);
			this.scale.refresh();
    } else {
      //  Same goes for mobile settings.
      //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(480, 260, 1024, 768);
      this.scale.forceLandscape = true;
    }
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  },

  preload: function() {

    //  Here we load the assets required for our preloader (in this case a loading bar)
    this.load.crossOrigin = true;
    this.load.baseURL = 'https://digital-brilliance-hour.github.io/phaser-shooter-base/';
    this.load.image('preloaderBar', 'assets/preloader-bar.png');

  },

  create: function() {

    //  By this point the preloader assets have loaded to the cache, we've set the game settings
    //  So now let's start the real preloader going
    this.state.start('Preloader');

  }

};

//preloading object
BasicGame.Preloader = function(game) {

  this.background = null;
  this.preloadBar = null;

  //this.ready = false;

};

BasicGame.Preloader.prototype = {

  preload: function() {

    //  Show the loading progress bar asset we loaded in boot.js
    this.load.crossOrigin = true;
    this.load.baseURL = 'https://digital-brilliance-hour.github.io/phaser-shooter-base/';
    this.stage.backgroundColor = '#2d2d2d';

    this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
    this.add.text(this.game.width / 2, this.game.height / 2 - 30, "Loading...", {
      font: "32px monospace",
      fill: "#fff"
    }).anchor.setTo(0.5, 0.5);

    //  This sets the preloadBar sprite as a loader sprite.
    //  What that does is automatically crop the sprite from 0 to full-width
    //  as the files below are loaded in.
    this.load.setPreloadSprite(this.preloadBar);

    //  Here we load the rest of the assets our game needs.
    this.load.image('titlepage', 'assets/titlepage.png');
    this.load.image('sea', 'assets/sea.png');
    this.load.image('sand', 'assets/sand.png');
    this.load.image('bullet', 'assets/bullet.png');
    // this.load.image('enemyBullet', 'assets/enemy-bullet.png');
    // this.load.image('powerup1', 'assets/powerup1.png');
    // this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
    // this.load.spritesheet('whiteEnemy', 'assets/shooting-enemy.png', 32, 32);
    // this.load.spritesheet('boss', 'assets/boss.png', 93, 75);
    // this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
    // this.load.spritesheet('player', 'assets/player.png', 64, 64);
    // this.load.audio('explosion', ['assets/explosion.ogg', 'assets/explosion.wav']);
    // this.load.audio('playerExplosion', ['assets/player-explosion.ogg', 'assets/player-explosion.wav']);
    // this.load.audio('enemyFire', ['assets/enemy-fire.ogg', 'assets/enemy-fire.wav']);
    // this.load.audio('playerFire', ['assets/player-fire.ogg', 'assets/player-fire.wav']);
    // this.load.audio('powerUp', ['assets/powerup.ogg', 'assets/powerup.wav']);
    //this.load.audio('titleMusic', ['audio/main_menu.mp3']);
    //  + lots of other required assets here

  },

  create: function() {

    //  Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
    this.preloadBar.cropEnabled = false;

  },

  update: function() {

    //  You don't actually need to do this, but I find it gives a much smoother game experience.
    //  Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
    //  You can jump right into the menu if you want and still play the music, but you'll have a few
    //  seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
    //  it's best to wait for it to decode here first, then carry on.

    //  If you don't have any music in your game then put the game.state.start line into the create function and delete
    //  the update function completely.

    //if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
    //{
    //  this.ready = true;
    this.state.start('MainMenu');
    //}

  }

};

//Main Menu object
BasicGame.MainMenu = function(game) {

  this.music = null;
  this.playButton = null;

};

BasicGame.MainMenu.prototype = {

  create: function() {

    //  We've already preloaded our assets, so let's kick right into the Main Menu itself.
    //  Here all we're doing is playing some music and adding a picture and button
    //  Naturally I expect you to do something significantly better :)

    this.add.sprite(0, 0, 'titlepage');

    this.loadingText = this.add.text(this.game.width / 2, this.game.height / 2 + 80, "Press Z or tap/click game to start", {
      font: "20px monospace",
      fill: "#fff"
    });
    this.loadingText.anchor.setTo(0.5, 0.5);
    // this.add.text(this.game.width / 2, this.game.height - 90, "image assets Copyright (c) 2002 Ari Feldman", { font: "12px monospace", fill: "#fff", align: "center"}).anchor.setTo(0.5, 0.5);
    //this.add.text(this.game.width / 2, this.game.height - 75, "sound assets Copyright (c) 2012 - 2013 Devin Watson", { font: "12px monospace", fill: "#fff", align: "center"}).anchor.setTo(0.5, 0.5);

  },

  update: function() {

    if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
      this.startGame();
    }
    //  Do some nice funky main menu effect here

  },

  startGame: function(pointer) {

    //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
    // this.music.stop();

    //  And start the actual game
    this.state.start('Game');

  }

};

//Game Logic Object
BasicGame.Game = function(game) {

};

BasicGame.Game.prototype = {

  create: function() {

    this.sea = this.add.tileSprite(0, 0, 1024, 768, 'sea');

  },

  update: function() {
    //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
  },

  quitGame: function(pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    this.state.start('MainMenu');

  }

};

//app loading
window.onload = function() {

  //  Create your Phaser game and inject it into the gameContainer div.
  //  We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div');

  //  Add the States your game has.
  //  You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
  game.state.add('Boot', BasicGame.Boot);
  game.state.add('Preloader', BasicGame.Preloader);
  game.state.add('MainMenu', BasicGame.MainMenu);
  game.state.add('Game', BasicGame.Game);

  //  Now start the Boot state.
  game.state.start('Boot');

};
