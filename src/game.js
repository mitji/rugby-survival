'use strict'

function Game() {
  this.canvas = null;
  this.ctx = null;
  this.gameScreen = null;
  this.player;
  this.defender;
  // this.country;
  // this.numberOfDdefenders;
  // this.difficulty;
}

Game.prototype.start = function() {
  // Wrap canvas and set size: 
  // Save reference to canvas and container. Create ctx
  this.canvasContainer = document.querySelector('.canvas-container');
  this.canvas = this.gameScreen.querySelector('canvas');
  this.ctx = this.canvas.getContext('2d');

  // Set the canvas to be same as the viewport size
  this.containerWidth = this.canvasContainer.offsetWidth;
  this.containerHeight = this.canvasContainer.offsetHeight;
  this.canvas.setAttribute('width', this.containerWidth);
  this.canvas.setAttribute('height', this.containerHeight);

  // Create new player
  this.player = new Player(this.canvas);
  this.defender1 = new Defender(this.canvas, this.canvas.height/2);
  this.defender2 = new Defender(this.canvas, this.canvas.height/2 + 100);

  // Create a callback for keydown
  this.handleKeyDown = function(event) {
    if (event.key === 'ArrowUp') {  
      this.player.setDirection('up');
    } else if (event.key === 'ArrowDown') {   
      this.player.setDirection('down');
    } else if (event.key === 'ArrowLeft') {
      this.player.setDirection('left');
    } else if (event.key === 'ArrowRight') {
      this.player.setDirection('right');
    }
  }
  this.handleKeyUp = function(event) {
    if (event.key === 'ArrowUp') {  
      this.player.directionY = 0;
    } else if (event.key === 'ArrowDown') {   
      this.player.directionY = 0;
    } else if (event.key === 'ArrowLeft') {
      this.player.directionX = 0;
    } else if (event.key === 'ArrowRight') {
      this.player.directionX = 0;
    }
  }

  var gameReference = this;

  document.body.addEventListener('keydown', this.handleKeyDown.bind(gameReference));
  document.body.addEventListener('keyup', this.handleKeyUp.bind(gameReference));
  
  // Start the game loop
  this.startLoop();
};

Game.prototype.startLoop = function() {
  var loop = function() {
    console.log('def1', this.defender1.directionY);
    console.log('def2', this.defender2.directionY);
    // Draw player


    if (this.defender1.isInBorderTop) {
      this.defender2.directionY = 1;
    } else if (this.defender2.isInBorderBottom) {
      this.defender1.directionY = -1;
    } 
    this.defender1.handleDefense();
    this.defender2.handleDefense();

    
    
    this.player.handleTry();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.draw();
    this.defender1.draw();
    this.defender2.draw();

    // This will be something like if (!this.gameIsOver)
    window.requestAnimationFrame(loop);
  }.bind(this);

  loop();
};

Game.prototype.checkTackle = function() {};

Game.prototype.updateMatchScore = function() {};

Game.prototype.setGameOver = function() {};