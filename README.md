# rugby-survival

## Description
Rugby Survival is an evasion game inspired in rugby and the Rugby World Cup 2019 (ongoing while doing this project). You play against three defenders that will try to tackle you. If you score a try, this gives you 5 points, and if you're tackled, the opposition scores 5 points. The game finishes when one of the two teams score 25 points or more.

## MVP (DOM - CANVAS)
Create Start Screen with a 'PLAY!' button that initiates the game. Then the game screen appears. Th game consists on one player that can move vertically and horizontally and three defenders that move only vertically (y axis) with a 2 - 1 distirbution. When there's a collision, the player goes back to initial position.
The player has 5 lives, and if it scores 5 tries, wins, if not, game over. After the game is finished (win or game over), a screen with the button 'New game!" appears. 


## Backlog
- Make 7 points if you score under the posts.
- If tackle -> add 5 points to opposition
- Add score in game screen
- Add score in game over screen
- Sounds: 
  - Add referee sound when button 'play' is clicked
  - Add tackle sound 
  - Add try sound
  - Add national anthem from the winning country
- In splash screen
  - Add country selector
  - Add #defenders selector
  - Add difficulty selector 
- Increase player speed with 'shift' key
- Add images and icons
- Add animation when tackled
- Add animation when score
- Add transitions between screens
- When win/game over, give the option to retry! or new game!
  - New game! will go to start game screen
  - retry! to game screen with same settings as before

## Data structure
### main.js

```js
// splash screen

createSplashScreen() {};
removeSplashScreen() {};

    
// game screen

createGameScreen() {};
removeGameScreen() {};

// game over screen

createGameOverScreen(score) {};
removeGameOverScreen() {};

// Setting the game state 

startGame() {};
gameOver() {};

````

### game.js

```js
Game(){
  this.canvas;
  this.ctx;
  this.player;
  this.defenders;
  // this.country;
  // this.numberOfDdefenders;
  // this.difficulty;
}

Game.prototype.start = function() {};

Game.prototype.startLoop = function() {};

Game.prototype.checkTackle = function() {};

Game.prototype.updateMatchScore = function() {};

Game.prototype.setGameOver = function() {};

```


### player.js

```js
Player() {
  this.canvas;
  this.ctx;
  this.size;
  this.position: {x: , y: }; // intialise position
  this.direction; // initialise direction to the right
  this.speed;
  this.lives;
  this.points;
  // this.isTackled;
}

Player.prototype.setDirection() = function() {};

// Player.prototype.speedUp() = function() {}; // --> backlog

Player.prototype.handleTry() = function() {};

Player.prototype.resetPosition() = function() {};

Player.prototype.removeLife = function() {}; // inside removeLife (collision) --> resetPosition

Player.prototype.draw() = function() {};

```


### defender.js

```js
Defender() {
  this.canvas;
  this.ctx;
  this.size;
  this.position: {x: ,y: };
  this.direction;
  this.speed;
  this.points;
  // this.numTackles; // 1 tackle = 5 points
}

Defender.prototype.updatePosition = function()

Defender.prototype.draw = function() {};
```


## States & States Transitions
Definition of the different states and their transition (transition functions)

- splashScreen
- gameScreen
- gameoverScreen
- winScreen


## Task
Main - buildDom

## Links


### Trello
[Link url](https://trello.com/b/Ujcomyy9/m1-project)


### Git
URls for the project repo and deploy
[Link Repo](https://github.com/mitji/rugby-survival)
[Link Deploy](http://github.com)


### Slides
URls for the project presentation (slides)
[Link Slides.com](http://slides.com)
