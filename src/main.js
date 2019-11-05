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
  var countryInfo;
  var whistleSound = new Audio();         // create the audio
  whistleSound.src = "./sounds/whistle.wav";   
  var nationalAnthem = new Audio(); 

  // splash screen

  function createSplashScreen() {
    splashScreen = buildDom(`
    <main>
      <img class="img-splash" src="./images/logo.png">
      <form class="selectors">
        <select id="countries-selector">
          <option value="England">England</option>
          <option value="France">France</option>
          <option value="New Zealand">New Zealand</option>
          <option value="Wales">Wales</option>
        </select>
        <select id="difficulty-selector">
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
          <option value="4">Leve 4</option>
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

  function createGameScreen(country, diffLevel) {
    gameScreen = buildDom(`
      <main class="game container">
        <div class="score-container">
          <img id="player-country" src="${country.iconFlagPath}">
          <span class="score-team">${country.name}</span> 
          <p class="score-local">0</p> 
          |
          <p class="score-visitant">0</p>
          <span class="score-team">RSA</span>  
          <img id="machine-country" src="./images/south-africa.png">
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

  function createGameOverScreen(score, isWin, country) {
    if (isWin === true) {
      gameOverScreen = buildDom(`
        <main class="container game-over">
          <div class="game-logo-container">
            <img class="game-logo" src="./images/logo.png">
          </div>
          <section class="results-container">
            <!--<h2>YOU WIN!!</h2>-->
            <div class="score-container final-score">
              <img id="player-country" src="${country.iconFlagPath}">
              <span class="score-team">${country.name}</span> 
              <p class="score-local">${score[0]}</p> 
              |
              <p class="score-visitant">${score[1]}</p>
              <span class="score-team">RSA</span>    
              <img id="machine-country" src="./images/south-africa.png">  
            </div>
          </section>
          
          <button>PLAY AGAIN!</button>
        </main>
      `);
    } else {
      gameOverScreen = buildDom(`
        <main class="container game-over">
          <div class="game-logo-container">
              <img class="game-logo" src="./images/logo.png">
            </div>
          <section class="results-container">
            <!--<h2>GAME OVER</h2>-->
            <!--<img class="gif-flag" src="${country.gifFlagPath}">-->
            <div class="score-container final-score">
              <img id="player-country" src="${country.iconFlagPath}">
              <span class="score-team">${country.name}</span> 
              <p class="score-local">${score[0]}</p> 
              |
              <p class="score-visitant">${score[1]}</p>
              <span class="score-team">RSA</span>    
              <img id="machine-country" src="./images/south-africa.png">  
            </div>
          </section>
          <button>PLAY AGAIN!</button>
        </main>
       `);
    }
    
    document.body.appendChild(gameOverScreen);
    
    nationalAnthem.src = country.nationalAnthem; 
    nationalAnthem.play();
    var playBtn = gameOverScreen.querySelector('button');
    playBtn.addEventListener('click', removeGameOverScreen);
  };
  function removeGameOverScreen() {
    nationalAnthem.pause();
    gameOverScreen.remove();
    createSplashScreen(); // now returns to inital state
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

  // set the game state
  function startGame(country) {

    var countrySelector = document.getElementById("countries-selector");
    var selCountry = countrySelector.value;
    countryInfo = getCountry(selCountry);

    var difficultySelector = document.getElementById("difficulty-selector");
    var diffLevel = difficultySelector.value;
    console.log('game started!');

    whistleSound.play();
    removeSplashScreen();

    game = new Game(diffLevel);
    game.gameScreen = createGameScreen(countryInfo, diffLevel);

    // Start the game

    game.start();

    // End the game
    game.passGameOverCallback(gameOver);
  };

  function gameOver(score, isWin) {
    console.log(countryInfo.name)
    removeGameScreen();
    createGameOverScreen(score, isWin, countryInfo);
  };

  // initialise Splash screen on initial start
  createSplashScreen();
}

// Runs the function `main` once all resources are loaded
window.addEventListener('load', main);