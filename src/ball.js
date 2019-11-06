'use strict'

function Ball(canvas) {
  this.canvas = canvas;
  this.ctx = this.canvas.getContext('2d');
  this.size = 10;
  this.x = canvas.width / 4;
  this.y = canvas.height / 2;
  this.directionX = 0; // initialise direction to the right
  this.directionY = 0;
  this.speed = 5;
}

Ball.prototype.draw = function() {
  this.ctx.fillStyle = '#FF6F27';
  this.ctx.fillRect(this.x, this.y, this.size, this.size);
}