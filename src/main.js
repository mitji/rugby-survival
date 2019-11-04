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
        <select id="countries">
          <option value="England">England</option>
          <option value="France">France</option>
          <option value="New Zealand">New Zealand</option>
          <option value="Wales">Wales</option>
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
          <img id="player-country" src="${country.iconFlagPath}">
          <span class="score-team">${country.name}</span> 
          <span class="score-local">0</span> 
          |
          <span class="score-visitant">0</span>
          <span class="score-team">RSA</span>  
          <img id="player-country" src="./images/south-africa.png">  
        </div>
        <img class="img-game" src="./images/logo.png">
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
        <main class="container">
          <h2>YOU WIN!!</h2>
          <div class="score-container final-score">
            <img id="player-country" src="${country.iconFlagPath}">
            <span class="score-team">${country.name}</span> 
            <span class="score-local">${score[0]}</span> 
            <span id="machine-country"class="score-visitant">${score[1]}</span>
            <span class="score-team">RSA</span>    
            <img id="player-country" src="./images/south-africa.png">  
          </div>
          <button>PLAY AGAIN!</button>
        </main>
      `);
    } else {
      gameOverScreen = buildDom(`
        <main class="container">
          <h2>GAME OVER</h2>
          <div class="score-container final-score">
            <img id="player-country" src="${country.iconFlagPath}">
            <span class="score-team">${country.name}</span> 
            <span class="score-local">${score[0]}</span> 
            <span class="score-visitant">${score[1]}</span>
            <span class="score-team">RSA</span>    
            <img id="player-country" src="./images/south-africa.png">  
          </div>
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
          nationalAnthem: './sounds/god-save-the-queen.mp3'
        }
      case 'France':
        return {
          name: 'FRA',
          iconFlagPath: './images/france.png'
        }
      case 'New Zealand':
      return {
        name: 'NZ',
        iconFlagPath: './images/new-zealand.png'
      }
      case 'Wales':
      return {
        name: 'WAL',
        iconFlagPath: './images/wales.png'
      }
    }
  }

  // set the game state
  function startGame(country) {

    var select_id = document.getElementById("countries");
    var countrySelected = select_id.value;
    countryInfo = getCountry(countrySelected);
    console.log('countryInfo', countryInfo);
    removeSplashScreen();
    console.log('game started!');

    game = new Game();
    game.gameScreen = createGameScreen(countryInfo);

    // Start the game
    whistleSound.play();
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