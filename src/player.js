'use strict'

function Player(canvas) {
  this.canvas = canvas;
  this.ctx = this.canvas.getContext('2d');
  this.size = 30;
  this.x = canvas.width / 4;
  this.y = canvas.height / 2;
  this.directionX = 0; 
  this.directionY = 0;
  this.speed = 4;
}

Player.prototype.draw = function() {
  var playerIcon = new Image();
  playerIcon.src = './images/rugby-player.png';
  this.ctx.drawImage(playerIcon, this.x, this.y, this.size, this.size);
};

Player.prototype.setDirection = function(direction) {
  if (direction === 'up' && this.y>=this.speed) this.directionY = -1;
  else if (direction === 'down' && this.y<=this.canvas.height-this.size-this.speed) this.directionY = 1;
  else if (direction === 'right') this.directionX = 1;
  else if (direction === 'left' && this.x>=this.speed) this.directionX = -1;
  else {
    this.directionX = 0;
    this.directionY = 0;
  }
};

Player.prototype.resetPosition = function() {
  this.speed = 4;
  this.x = this.canvas.width / 4;
  this.y = this.canvas.height / 2;
};





