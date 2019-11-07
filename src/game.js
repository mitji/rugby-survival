'use strict'

function Game(difficulty) {
  this.canvas = null;
  this.ctx = null;
  this.gameScreen = null;
  this.player = null;
  this.ball = null;
  this.defender1 = null;
  this.defender2 = null;
  this.defender3 = null;
  this.defender4 = null;
  this.difficulty = difficulty;
  this.scorePlayer = 0;
  this.scoreOpposition = 0;
  this.score = [];
  this.isBallKicked = false; // for the drop (maybe for tackle, try, and drop messages)
  this.gameIsOver = false;
  this.isWin = false;
  this.kicksCounter = 0;
  this.kicksAllowed = 2;
  this.speedArr = []; // store all speeds to reassign it after the kick
  // this.playerCountry = playerCountry;
  // this.machineCountry = machineCountry;
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
  // Create ball
  this.ball = new Ball(this.canvas);

  // Create defenders
  this.defender1 = new Defender(this.canvas, this.canvas.width/2, this.canvas.height/2);
  this.defender2 = new Defender(this.canvas, this.canvas.width/2, this.canvas.height/2 + 100);
  this.defender3 = new Defender(this.canvas, this.canvas.width/2 + 150, this.canvas.height/2 - 20);
  this.defenders = [this.defender1, this.defender2, this.defender3];
  
  if (this.difficulty === '3' || this.difficulty === '4') {
    this.kicksAllowed = 4;
    this.defender4 = new Defender(this.canvas, this.canvas.width/2 + 150, this.canvas.height/2 + 250);
    this.defenders.push(this.defender4);
  } 
  if (this.difficulty === '4') {
    this.player.speed += 1;
    this.defender5 = new Defender(this.canvas, this.canvas.width/2 + 200, this.canvas.height/2);
    this.defender5.speed = 2;
    this.defenders.push(this.defender5);
  }
  this.defenders.forEach( function(element) {
    element.setSpeed(this.difficulty);
  }.bind(this));

  // store all speeds to reassign it after the kick 
  this.defenders.forEach( function(defender,i) {
    this.speedArr[i] = defender.speed;
  }.bind(this))

  // add kicks in score
  var score = this.gameScreen.querySelector('.score-container');
  var numKicksContainer = document.createElement('p');
  numKicksContainer.classList.add('score-kicks');
  score.appendChild(numKicksContainer);
  numKicksContainer.innerHTML = `Kicks: <strong>${this.kicksAllowed}</strong>`;

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
    } else if (event.code === 'Space') {
      this.player.speed += 5;
    } else if (event.key === 'd') {
      this.kicksCounter+=1;
      if (this.kicksCounter <= this.kicksAllowed) {
        this.isBallKicked = true;
        numKicksContainer.innerHTML = `Kicks: <strong>${this.kicksAllowed-this.kicksCounter}</strong>`;
        console.log('ball kicked!');
      }
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
    } else if (event.code === 'Space') {
      this.player.speed -= 5;
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
    this.handleDefenseMovement();
    if (this.defender5 != null) {
      this.handleFullbackPosition();
    }
    
    this.handlePlayerPosition();
    this.handleBall();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.player.draw();
    if (this.isBallKicked) {
      this.checkBallCollision();
      this.ball.draw();
    }
    this.defenders.forEach( function(defender) {
      defender.draw();
    });
    if (this.defender5 != null) {
      this.defender5.draw();
    }

    this.setGameOver();

    if (!this.gameIsOver) {
      window.requestAnimationFrame(loop);
    }
  }.bind(this);

  loop();
};

// Defense functions
Game.prototype.handleDefenseMovement = function() {
  var x_collision;
  this.defenders.forEach( function(defender,i) {
    
    if (this.isBallKicked === false) {
      defender.speed = this.speedArr[i];
    } else {
      defender.speed = 0;
    }
    if (i!=4) {
      defender.y = defender.y + defender.directionY * defender.speed; // updates height of the defender in every same
      defender.isInBorderTop = false;
      defender.isInBorderBottom = false;
      if (defender.y>= (defender.canvas.height-defender.size) || defender.y<= 0) {
        x_collision = defender.x;
      }
    }
  }.bind(this));
  this.defenders.forEach( function(defender) {
    if (x_collision === defender.x) {
      defender.directionY *= -1;
    }
  })
};

Game.prototype.handleFullbackPosition = function() {
  if (this.player.x < this.defender5.x) {
    this.defender5.directionX = -1;
  } else if (this.player.x > this.defender5.x) {
    this.defender5.directionX = 1;
  } else {
    this.defender5.directionX = 0;
  }

  if (this.player.y < this.defender5.y) {
    this.defender5.directionY = -1;
  } else if (this.player.y > this.defender5.y) {
    this.defender5.directionY = 1;
  } else {
    this.defender5.directionY = 0;
  }

  this.defender5.y = this.defender5.y + this.defender5.directionY * this.defender5.speed;
  this.defender5.x = this.defender5.x + this.defender5.directionX * this.defender5.speed;
}

Game.prototype.defenseResetPosition = function() {
  this.defender1.x = this.canvas.width/2;
  this.defender1.y = this.canvas.height/2;

  this.defender2.x = this.canvas.width/2;
  this.defender2.y = this.canvas.height/2 + 100;

  this.defender3.x = this.canvas.width/2 + 150;
  this.defender3.y =  this.canvas.height/2 - 20;

  if (this.defender4 != null) {
    this.defender4.x = this.canvas.width/2 + 150;
    this.defender4.y =  this.canvas.height/2 +250;
  }
  if (this.defender5 != null) {
    this.defender5.x = this.canvas.width/2 + 200;
    this.defender5.y =  this.canvas.height/2;
  }
}

// Player functions
Game.prototype.handlePlayerPosition = function() {
  
  // handle Screen collisions
  if (this.player.x<=0 && this.player.y<=0) {
    this.player.x = 0; 
    this.player.y = 0;
  }
  else if (this.player.x<=0 && this.player.y>=this.player.canvas.height-this.player.size) {
    this.player.x = 0; 
    this.player.y = this.player.canvas.height-this.player.size;
  }
  else if (this.player.x<=0) this.player.x = 0;
  else if (this.player.y>= this.player.canvas.height-this.player.size) this.player.y = this.player.canvas.height-this.player.size;
  else if (this.player.y<=0) this.player.y = 0;
  
  
  this.player.y = this.player.y + this.player.directionY * this.player.speed;
  this.player.x = this.player.x + this.player.directionX * this.player.speed;

  // try
  if(this.player.x >= this.canvas.width - 80) {
    this.player.resetPosition();
    this.defenseResetPosition();
    this.scorePlayer += 5;
    var spanLocalScore = document.querySelector('.score-local');
    spanLocalScore.innerHTML = this.scorePlayer;
  }
};

Game.prototype.isTackled = function(defender) {
  var playerLeft = this.player.x;
  var playerRight = this.player.x + this.player.size;
  var playerTop = this.player.y;
  var playerBottom = this.player.y + this.player.size;

  var defenderLeft = defender.x;
  var defenderRight = defender.x + defender.size;
  var defenderTop = defender.y;
  var defenderBottom = defender.y + defender.size;

  // Check if the defender tackles player
  var crossLeft = defenderLeft <= playerRight && defenderLeft >= playerLeft;
    
  var crossRight = defenderRight >= playerLeft && defenderRight <= playerRight;
  
  var crossBottom = defenderBottom >= playerTop && defenderBottom <= playerBottom;
  
  var crossTop = defenderTop <= playerBottom && defenderTop >= playerTop;

  if ((crossLeft || crossRight) && (crossTop || crossBottom)) {
    this.scoreOpposition += 5;
    var spanVisitantScore = document.querySelector('.score-visitant');
    spanVisitantScore.innerHTML = this.scoreOpposition;
    this.defenseResetPosition();
    return true;
  }
  return false;
};
Game.prototype.checkTackle = function() {
  this.defenders.forEach( function(defender) {
    if ( this.isTackled(defender) ) {
      this.player.resetPosition();
      console.log('tackleeee!!');  
    }
  }, this);
}

// Ball functions
Game.prototype.handleBall = function() {
  if (this.isBallKicked === true) {
    this.player.speed = 0;
    this.ball.directionX = 1;
    
    if (this.ball.y < this.canvas.height/2) { 
      this.ball.directionY = 1;
    } else if (this.ball.y > this.canvas.height/2) { 
      this.ball.directionY = -1;
    }

    // apply tales theorem
    var a = Math.abs((this.canvas.height/2) - (this.canvas.height - this.ball.y));
    var c = Math.abs(this.canvas.width - 80 - this.ball.x);
    var d = this.ball.speed;
    var b = (a*d)/c;

    this.ball.x = this.ball.x + this.ball.speed;
    this.ball.y = this.ball.y + b*this.ball.directionY;

    // score kick (named 'drop goal')
    if(this.ball.x > this.canvas.width - 70) {
      this.isBallKicked = false;
      console.log('goal!!');
      this.player.resetPosition();
      this.defenseResetPosition();
      this.scorePlayer += 3;
      var spanLocalScore = document.querySelector('.score-local');
      spanLocalScore.innerHTML = this.scorePlayer;
    }
  } else {
    this.ball.x = this.player.x;
    this.ball.y = this.player.y;
  }
}

Game.prototype.checkBallCollision = function() {
  this.defenders.forEach( function(defender) {
    var ballLeft = this.ball.x;
    var ballRight = this.ball.x + this.ball.size;
    var ballTop = this.ball.y;
    var ballBottom = this.ball.y + this.ball.size;

    var defenderLeft = defender.x;
    var defenderRight = defender.x + defender.size;
    var defenderTop = defender.y;
    var defenderBottom = defender.y + defender.size;

    // Check if the defender intercepts ball
    var crossLeft = defenderLeft <= ballRight && defenderLeft >= ballLeft;
      
    var crossRight = defenderRight >= ballLeft && defenderRight <= ballRight;
    
    var crossBottom = defenderBottom >= ballTop && defenderBottom <= ballBottom;
    
    var crossTop = defenderTop <= ballBottom && defenderTop >= ballTop;

    if ((crossLeft || crossRight) && (crossTop || crossBottom)) {
      this.isBallKicked = false;
      this.scoreOpposition += 3;
      this.defenseResetPosition();
      this.player.resetPosition();
      var spanVisitantScore = document.querySelector('.score-visitant');
      spanVisitantScore.innerHTML = this.scoreOpposition;
      console.log('ball intercepted by defense')
    }
  }, this);
}

Game.prototype.updateMatchScore = function() {
  return [this.scorePlayer, this.scoreOpposition]
};

Game.prototype.setGameOver = function() {
  if(this.scorePlayer>=25 || this.scoreOpposition>=25) {
    this.score = this.updateMatchScore();
    if (this.scorePlayer > this.scoreOpposition) {
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
