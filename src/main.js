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
  var playerInfo;
  var machineInfo;
  var whistleSound = new Audio();         // create the audio
  whistleSound.src = "./sounds/whistle.wav";   
  var nationalAnthem = new Audio(); 

  // splash screen

  function createSplashScreen() {
    splashScreen = buildDom(`
    <main>
      <img class="img-splash" src="./images/logo.png">
      <form class="selectors">
        <select id="country-selector__player">
          <option value="England">England</option>
          <option value="France">France</option>
          <option value="New Zealand">New Zealand</option>
          <option value="Wales">Wales</option>
        </select>
        <select id="country-selector__machine">
          <option value="England">England</option>
          <option value="France">France</option>
          <option value="New Zealand">New Zealand</option>
          <option value="Wales">Wales</option>
        </select>
        <select id="difficulty-selector">
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
          <option value="4">Level 4</option>
        </select>
      </form>
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

  function createGameScreen(playerCountry, machineCountry, diffLevel) {
    gameScreen = buildDom(`
      <main class="game container">
        <div class="score-container">
          <img id="player-country" src="${playerCountry.iconFlagPath}">
          <span class="score-team">${playerCountry.name}</span> 
          <p class="score-local">0</p> 
          |
          <p class="score-visitant">0</p>
          <span class="score-team">${machineCountry.name}</span>  
          <img id="machine-country" src="${machineCountry.iconFlagPath}">
          <p class="score-diff-level">Difficulty level: <strong>${diffLevel}</strong></p>
        </div>
        <div class="game-logo-container">
          <img class="game-logo" src="./images/logo.png">
        </div>
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

  function createGameOverScreen(score, isWin, playerCountry, machineCountry) {
    if (isWin === true) {
      gameOverScreen = buildDom(`
        <main class="container game-over">
          <div class="game-logo-container">
            <img class="game-logo" src="./images/logo.png">
          </div>
          <section class="results-container">
            <!--<h2>YOU WIN!!</h2>-->
            <div class="score-container final-score">
              <img id="player-country" src="${playerCountry.iconFlagPath}">
              <span class="score-team">${playerCountry.name}</span> 
              <p class="score-local">${score[0]}</p> 
              |
              <p class="score-visitant">${score[1]}</p>
              <span class="score-team">${machineCountry.name}</span>    
              <img id="machine-country" src="${machineCountry.iconFlagPath}">  
            </div>
          </section>
          
          <button>PLAY AGAIN!</button>
        </main>
      `);
      nationalAnthem.src = playerCountry.nationalAnthem; 
    } else {
      gameOverScreen = buildDom(`
        <main class="container game-over">
          <div class="game-logo-container">
              <img class="game-logo" src="./images/logo.png">
            </div>
          <section class="results-container">
            <!--<h2>GAME OVER</h2>-->
            <!--<img class="gif-flag" src="${playerCountry.gifFlagPath}">-->
            <div class="score-container final-score">
              <img id="player-country" src="${playerCountry.iconFlagPath}">
              <span class="score-team">${playerCountry.name}</span> 
              <p class="score-local">${score[0]}</p> 
              |
              <p class="score-visitant">${score[1]}</p>
              <span class="score-team">${machineCountry.name}</span>    
              <img id="machine-country" src="${machineCountry.iconFlagPath}">  
            </div>
          </section>
          <button>PLAY AGAIN!</button>
        </main>
      `);
      nationalAnthem.src = machineCountry.nationalAnthem; 
    }
    
    document.body.appendChild(gameOverScreen);
    
    
    nationalAnthem.play();
    var playBtn = gameOverScreen.querySelector('button');
    playBtn.addEventListener('click', removeGameOverScreen);
  };
  function removeGameOverScreen() {
    nationalAnthem.pause();
    gameOverScreen.remove();
    createSplashScreen(); // now returns to inital state
  };

  // set the game state
  function startGame(country) {

    var playerCountrySel = document.getElementById("country-selector__player");
    var playerCountry = playerCountrySel.value;

    var machineCountrySel = document.getElementById("country-selector__machine");
    var machineCountry = machineCountrySel.value;

    playerInfo = getCountry(playerCountry);
    machineInfo = getCountry(machineCountry);

    var difficultySelector = document.getElementById("difficulty-selector");
    var diffLevel = difficultySelector.value;
    console.log('game started!');

    whistleSound.play();
    removeSplashScreen();

    game = new Game(diffLevel);
    game.gameScreen = createGameScreen(playerInfo, machineInfo, diffLevel);

    // Start the game
    game.start();

    // End the game
    game.passGameOverCallback(gameOver);
  };

  function gameOver(score, isWin) {
    removeGameScreen();
    createGameOverScreen(score, isWin, playerInfo, machineInfo);
  };

  function getCountry(country) {
    switch (country) {
      case 'England':
        return {
          name: 'ENG',
          iconFlagPath: './images/england.png',
          gifFlagPath: './images/englandGif.gif',
          nationalAnthem: './sounds/god-save-the-queen.mp3',
          winned: 0,
          lost: 0,
        }
      case 'France':
        return {
          name: 'FRA',
          iconFlagPath: './images/france.png',
          gifFlagPath: './images/franceGif.gif',
          nationalAnthem: './sounds/la-marseillaise.mp3',
          winned: 0,
          lost: 0,
        }
      case 'New Zealand':
        return {
          name: 'NZ',
          iconFlagPath: './images/new-zealand.png',
          gifFlagPath: './images/NZGif.gif',
          nationalAnthem: './sounds/la-marseillaise.mp3',
          winned: 0,
          lost: 0,
        }
      case 'Wales':
        return {
          name: 'WAL',
          iconFlagPath: './images/wales.png',
          gifFlagPath: './images/walesGif.gif',
          nationalAnthem: './sounds/la-marseillaise.mp3',
          winned: 0,
          lost: 0,
        }
    }
  }
  // initialise Splash screen on initial start
  createSplashScreen();
}

// Runs the function `main` once all resources are loaded
window.addEventListener('load', main);