'use strict'

function Defender(canvas, x, y) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.size = 30; // same size as player
  this.x = x;
  this.y = y; 
  //this.directionX;
  this.directionY = -1;// MVP only position Y
  this.speed = 2;
  // this.points;
  // this.numTackles; // 1 tackle = 5 points
  this.isInBorderTop = false;
  this.isInBorderBottom = false;
}

Defender.prototype.handleDefenseMovement = function() {
  this.y = this.y + this.directionY * this.speed; // updates height of the player in every same
  this.isInBorderTop = false;
  this.isInBorderBottom = false;
  if (this.y>= (this.canvas.height-this.size)) {
    this.directionY = -1; 
    this.isInBorderBottom = true;
  }
  else if (this.y<= 0) {
    this.directionY = 1; 
    this.isInBorderTop = true;
  }
};

Defender.prototype.draw = function() {
  this.ctx.fillStyle = 'purple';
  // fillRect(x, y, width, height)
  this.ctx.fillRect(this.x, this.y, this.size, this.size);
};