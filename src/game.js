'use strict'

function Game() {
  this.canvas = null;
  this.ctx = null;
  this.gameScreen = null;
  this.player = null;
  this.defender;
  this.gameIsOver = false;
  this.score = [];
  this.isWin = false;
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
  this.defender1 = new Defender(this.canvas, this.canvas.width/2, this.canvas.height/2);
  this.defender2 = new Defender(this.canvas, this.canvas.width/2, this.canvas.height/2 + 100);
  this.defender3 = new Defender(this.canvas, this.canvas.width/2 + 150, this.canvas.height/2 + 50);
  this.defenders = [this.defender1, this.defender2, this.defender3];

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

    this.checkTackle();
    // For many defenders, I'll have to do the same as in the code along
    this.handleDefenseMovement();
    
    this.player.handlePlayerPosition();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.player.draw();
    this.defender1.draw();
    this.defender2.draw();
    this.defender3.draw();

    this.setGameOver();

    // This will be something like if (!this.gameIsOver)
    if (!this.gameIsOver) {
      window.requestAnimationFrame(loop);
    }
  }.bind(this);

  loop();
};

Game.prototype.handleDefenseMovement = function() {
  // forEach defender do all this below
  var x_collision;
  this.defenders.forEach( function(defender) {
    defender.y = defender.y + defender.directionY * defender.speed; // updates height of the defender in every same
    defender.isInBorderTop = false;
    defender.isInBorderBottom = false;
    if (defender.y>= (defender.canvas.height-defender.size) || defender.y<= 0) {
      x_collision = defender.x;
    }
  });
  console.log(x_collision);
  this.defenders.forEach( function(defender) {
    console.log('collison',x_collision);
    if (x_collision === defender.x) {
      console.log('in')
      defender.directionY *= -1;
    }
  })
};

Game.prototype.checkTackle = function() {
  this.defenders.forEach( function(defender) {
    if ( this.player.isTackled(defender) ) {
      this.player.resetPosition();
      console.log('tackleeee!!');  
    }
  }, this);
}

Game.prototype.matchScore = function() {
  return [this.player.scorePlayer, this.player.scoreOpposition]
};

Game.prototype.setGameOver = function() {
  if(this.player.scorePlayer>=25 || this.player.scoreOpposition>=25) {
    this.score = this.matchScore();
    if (this.player.scorePlayer > this.player.scoreOpposition) {
      this.isWin = true;
    }
    this.gameIsOver = true;
    console.log('GAME OVER');
    this.onGameOverCallback(this.score, this.isWin);
  }
};

Game.prototype.passGameOverCallback = function(callback) {
  this.onGameOverCallback = callback;
};
