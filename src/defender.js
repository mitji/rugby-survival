'use strict'

function Defender(canvas, x, y) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.size = 30; // same size as player
  this.x = x;
  this.y = y; 
  this.directionX = -1; //for player 4
  this.directionY = -1;// MVP only position Y
  this.speed = 3;
  // this.points;
  // this.numTackles; // 1 tackle = 5 points
  this.isInBorderTop = false;
  this.isInBorderBottom = false;
}

Defender.prototype.setSpeed = function(difficulty) {
  if (difficulty!=1) {
    this.speed += 1;
  }
}

Defender.prototype.draw = function() {
  var defenderIcon = new Image();
  defenderIcon.src = './images/defender.png';
  // put Sam Underhill and the other flanker
  this.ctx.drawImage(defenderIcon, this.x, this.y, this.size, this.size);
};