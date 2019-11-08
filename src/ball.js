'use strict'

function Ball(canvas) {
  this.canvas = canvas;
  this.ctx = this.canvas.getContext('2d');
  this.size = 30;
  this.x = canvas.width / 4;
  this.y = canvas.height / 2;
  this.directionX = 0;
  this.directionY = 0;
  this.speed = 5;
}

Ball.prototype.draw = function() {
  var ballIcon = new Image();
  ballIcon.src = './images/ball.png';
  this.ctx.drawImage(ballIcon,this.x, this.y, this.size, this.size);
}