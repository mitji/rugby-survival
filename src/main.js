'use strict';

// Creates DOM elements from a string representation
function buildDom(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString;

  return div.children[0];
};

function main() {
  var game; // instance of the Game
  var splashScreen; // Start Screen
  var gameOverScreen;

  // splash screen

  function createSplashScreen() {
    splashScreen = buildDom(`
    <main>
      <h1>Rugby Survival</h1>
      <button>PLAY!</button>
    </main>
    `);

    document.body.appendChild(splashScreen);

    var playBtn = splashScreen.querySelector('button');
    playBtn.addEventListener('click', startGame);
  };

  function removeSplashScreen() {
    splashScreen.remove();
  };

  
  // game screen

  function createGameScreen() {
    var gameScreen = buildDom(`
      <main class="game container">
        <header>
          <div class="game-name">
            <h2>Rugby Survival</h2>
          </div>
          <div class="lives">
            <span class="label">Lives:</span>
            <span class="value"></span>
          </div>  
        </header>
        <div class="canvas-container">
          <canvas></canvas>
        </div>
      </main>
    `);

    document.body.appendChild(gameScreen);

    return gameScreen;
  }; // I will need to pass all the info: country, etc, right?
  function removeGameScreen() {
    gameScreen.remove();
  };


  // game over screen

  function createGameOverScreen() {}; // I will need to pass the score
  function removeGameOverScreen() {};


  // set the game state
  function startGame() {
    removeSplashScreen();
    console.log('game started!');

    game = new Game();
    game.gameScreen = createGameScreen();

    // Start the game
    game.start();
    // End the game

  };

  function gameOver(score) {

  };

  // initialise Splash screen on initial start
  createSplashScreen();
}

// Runs the function `main` once all resources are loaded
window.addEventListener('load', main);