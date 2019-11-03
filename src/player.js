function Player(canvas) {
  this.canvas = canvas;
  this.ctx = this.canvas.getContext('2d');

  this.size = 30;
  this.x = canvas.width / 4;
  this.y = canvas.height / 2;
  this.directionX = 0; // initialise direction to the right
  this.directionY = 0;
  this.speed = 4;
  this.lives;
  this.points;
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

Player.prototype.handleTry = function() {
  //console.log(this.x, this.y);
  this.y = this.y + this.directionY * this.speed;
  this.x = this.x + this.directionX * this.speed;
};

Player.prototype.resetPosition = function() {};

Player.prototype.removeLife = function() {}; // inside removeLife (collision) --> resetPosition

