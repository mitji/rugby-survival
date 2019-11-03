function Player(canvas) {
  this.canvas = canvas;
  this.ctx = this.canvas.getContext('2d');

  this.size = 30;
  this.x = canvas.width / 4;
  this.y = canvas.height / 2;
  this.directionX = 0; // initialise direction to the right
  this.directionY = 0;
  this.speed = 4;
  this.lives = 4;
  this.scoreLocal = 0;
  this.scoreOpposition = 0;
  // this.isTackled;
}

Player.prototype.draw = function() {
  //this.ctx.fillStyle = '#66D3FA';
  let icon = new Image();
  icon.url = '../images/imgbin-rugby-union-rugby-ball-sport-computer-icons-rugby-players-10kXX6LTdSy6Fjn3uGgVKQDmv.jpg';
  
  this.ctx.fillStyle = this.ctx.createPattern(icon, 'no-repeat');
  // fillRect(x, y, width, height)
  this.ctx.fillRect(this.x, this.y, this.size, this.size);
};

Player.prototype.setDirection = function(direction) {
  if (direction === 'up') this.directionY = -1;
  else if (direction === 'down') this.directionY = 1;
  else if (direction === 'right') this.directionX = 1;
  else if (direction === 'left') this.directionX = -1;
  else {
    this.directionX = 0;
    this.directionY = 0;
  }
};

// Player.prototype.speedUp() = function() {}; // --> backlog

Player.prototype.playerPosition = function() {
  
  // handle Screen collisions
  if (this.x<=0) this.x = 0;
  else if (this.y>= this.canvas.height-this.size) this.y = this.canvas.height-this.size;
  else if (this.y<=0) this.y = 0;
  else if (this.x<=0 && this.y<=0) { // not working
    this.x = 0; 
    this.y = 0;
  }
  else if (this.x<=0 && this.canvas.height-this.size) { // not working
    this.x = 0; 
    this.y = this.canvas.height-this.size;
  }
  
  this.y = this.y + this.directionY * this.speed;
  this.x = this.x + this.directionX * this.speed;

  // try
  if(this.x >= this.canvas.width - 80) {
    console.log('try');
    this.resetPosition();
    this.scoreLocal += 5;
    var spanLocalScore = document.querySelector('.score-local');
    spanLocalScore.innerHTML = this.scoreLocal;
  }

  
};

Player.prototype.isTackled = function(defender) {
  var playerLeft = this.x;
  var playerRight = this.x + this.size;
  var playerTop = this.y;
  var playerBottom = this.y + this.size;

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
    return true;
  }
  return false;
};

Player.prototype.resetPosition = function() {
  this.x = this.canvas.width / 4;
  this.y = this.canvas.height / 2;
};

Player.prototype.removeLife = function() {
  this.lives -= 1;
}; // inside removeLife (collision) --> resetPosition

