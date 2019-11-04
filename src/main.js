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
  var gameScreen;
  var gameOverScreen;

  // splash screen

  function createSplashScreen() {
    splashScreen = buildDom(`
    <main>
      <img class="img-splash" src="../images/logo.png">
      <form class="selectors">
        <select id="countries">
          <option value="England">England</option>
          <option value="France">France</option>
        </select>
      </form>
      <button>PLAY!</button>
    </main>
    `);

    document.body.appendChild(splashScreen);
    //country = document.getElementById('countries');
    var playBtn = splashScreen.querySelector('button');
    playBtn.addEventListener('click', startGame);
  };

  function removeSplashScreen() {
    splashScreen.remove();
  };

  
  // game screen

  function createGameScreen(country) {
    gameScreen = buildDom(`
      <main class="game container">
        <div class="score-container">
          <span class="score-team">${country.name}</span> 
          <span class="score-local">0</span> 
          <span class="score-visitant">0</span>
          <span class="score-team">ESP</span>    
        </div>
        <img class="img-game" src="../images/logo.png">
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

  function createGameOverScreen(score, isWin) {
    if (isWin === true) {
      gameOverScreen = buildDom(`
        <main class="game container">
          <h1>YOU WIN!!<h1>
          <h2 class="score-container">${score[0]} - ${score[1]}</h2>
          <button>PLAY AGAIN!</button>
        </main>
      `);
    } else {
      gameOverScreen = buildDom(`
        <main class="game container">
          <h1>GAME OVER<h1>
          <h2 class="score-container final-score">${score[0]} - ${score[1]}</h2>
          <button>PLAY AGAIN!</button>
        </main>
       `);
    }
    document.body.appendChild(gameOverScreen);

    var playBtn = gameOverScreen.querySelector('button');
    playBtn.addEventListener('click', removeGameOverScreen);
  };
  function removeGameOverScreen() {
    gameOverScreen.remove();
    startGame();
  };

  function getCountry(country) {
    switch (country) {
      case 'England':
        return {
          name: 'ENG',
        }
      case 'France':
        return {
          name: 'FRA',
        }
    }
  }

  // set the game state
  function startGame(country) {

    var select_id = document.getElementById("countries");
    var countrySelected = select_id.value;
    var countryInfo = getCountry(countrySelected);
    removeSplashScreen();
    console.log('game started!');

    game = new Game();
    game.gameScreen = createGameScreen(countryInfo);

    // Start the game
    game.start();
    // End the game
    game.passGameOverCallback(gameOver);
  };

  function gameOver(score, isWin) {
    removeGameScreen();
    createGameOverScreen(score, isWin);
  };

  // initialise Splash screen on initial start
  createSplashScreen();
}

// Runs the function `main` once all resources are loaded
window.addEventListener('load', main);