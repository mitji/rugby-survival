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
  var classification;
  var countriesInit = [
    {
      name: 'ENG',
      iconFlagPath: './images/england.png',
      gifFlagPath: './images/englandGif.gif',
      nationalAnthem: './sounds/god-save-the-queen.mp3',
      winned: 0,
      lost: 0,
    },
    {
      name: 'FRA',
      iconFlagPath: './images/france.png',
      gifFlagPath: './images/franceGif.gif',
      nationalAnthem: './sounds/la-marseillaise.mp3',
      winned: 0,
      lost: 0,
    },
    {
      name: 'NZ',
      iconFlagPath: './images/new-zealand.png',
      gifFlagPath: './images/NZGif.gif',
      nationalAnthem: './sounds/god-defend-nz.mp3',
      winned: 0,
      lost: 0,
    },
    {
      name: 'WAL',
      iconFlagPath: './images/wales.png',
      gifFlagPath: './images/walesGif.gif',
      nationalAnthem: './sounds/wales.mp3',
      winned: 0,
      lost: 0,
    },
    {
      name: 'RSA',
      iconFlagPath: './images/south-africa.png',
      gifFlagPath: './images/walesGif.gif',
      nationalAnthem: './sounds/sa.mp3',
      winned: 0,
      lost: 0,
    } 
  ];

  // splash screen

  function createSplashScreen() {
    splashScreen = buildDom(`
    <main>
      <img class="img-splash" src="./images/logo.png">
      <div class="selector-title">
        <span>Your team</span>
        <span>Machine team</span>
        <span>Difficulty</span>
      </div>
      <form class="selectors">
        <select id="country-selector__player">
          <option value="England">England</option>
          <option value="France">France</option>
          <option value="New Zealand">New Zealand</option>
          <option value="Wales">Wales</option>
          <option value="South Africa">South Africa</option>
        </select>
        <select id="country-selector__machine">
          <option value="England">England</option>
          <option value="France">France</option>
          <option value="New Zealand">New Zealand</option>
          <option value="Wales">Wales</option>
          <option value="South Africa" selected="selected">South Africa</option>
        </select>
        <select id="difficulty-selector">
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
          <option value="4">Level 4</option>
        </select>
      </form>
      <button class="instructions-btn">
        <span class="instructions-btn-text">Instructions</span>
      </button>
      <button class="play-btn">PLAY!</button>
    </main>
    `);

    document.body.appendChild(splashScreen);

    var playBtn = splashScreen.querySelector('.play-btn');
    playBtn.addEventListener('click', startGame);

    var instructionsBtn = splashScreen.querySelector('.instructions-btn');
    instructionsBtn.addEventListener('click', function() {
      var instructionsContainer = document.body.querySelector('.instructions');
      instructionsContainer.classList.remove('not-visible');
      instructionsContainer.classList.add('visible');
    })
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
    var countriesStringified = localStorage.getItem('countries');
    var countriesParsed;
    if(!countriesStringified) {
      countriesParsed = countriesInit;
    } else {
      // Retrieve the stored data from local storage  
      const countriesRetrieved = localStorage.getItem('countries');
      countriesParsed = JSON.parse(countriesRetrieved);
    }

    // Take winner team
    var indexOfPlayer = countriesParsed.map( function(country) {
      return country.name; 
    }).indexOf(playerCountry.name);

    // Take looser team
    var indexOfMachine = countriesParsed.map( function(country) { 
      return country.name; 
    }).indexOf(machineCountry.name);

    // Add win or lost
    if (isWin === true) {
      countriesParsed[indexOfPlayer].winned += 1;
      countriesParsed[indexOfMachine].lost += 1;

      nationalAnthem.src = playerCountry.nationalAnthem; 
    } else {
      countriesParsed[indexOfPlayer].lost += 1;
      countriesParsed[indexOfMachine].winned += 1;
      nationalAnthem.src = machineCountry.nationalAnthem; 
    }

    // Update classification
    countriesParsed.sort( function(a, b) {
        return b.winned - a.winned;
    });
    countriesParsed;

    // Stringify again and set new item
    const newStringifiedCountries = JSON.stringify(countriesParsed);
    localStorage.setItem('countries', newStringifiedCountries);

    gameOverScreen = buildDom(`
      <main class="container game-over">
        <div class="game-logo-container">
          <img class="game-logo" src="./images/logo.png">
        </div>
        <section class="results-container">
          <div class="score-container final-score">
            <img id="player-country" src="${playerCountry.iconFlagPath}">
            <span class="score-team">${playerCountry.name}</span> 
            <p class="score-local">${score[0]}</p> 
            |
            <p class="score-visitant">${score[1]}</p>
            <span class="score-team">${machineCountry.name}</span>    
            <img id="machine-country" src="${machineCountry.iconFlagPath}">  
          </div>
          <div class="classification-container">
            <h2>Classification</h2>
            <button class="reset-btn">Reset classification</button>
            <table>
              <tr>
                <th>Country</th>
                <th>Games winned</th>
                <th>Games lost</th>
              </tr>
              <tr>
                <td>${countriesParsed[0].name}</td>
                <td>${countriesParsed[0].winned}</td>
                <td>${countriesParsed[0].lost}</td>
              </tr>
              <tr>
                <td>${countriesParsed[1].name}</td>
                <td>${countriesParsed[1].winned}</td>
                <td>${countriesParsed[1].lost}</td>
              </tr>
              <tr>
                <td>${countriesParsed[2].name}</td>
                <td>${countriesParsed[2].winned}</td>
                <td>${countriesParsed[2].lost}</td>
              </tr>
              <tr>
                <td>${countriesParsed[3].name}</td>
                <td>${countriesParsed[3].winned}</td>
                <td>${countriesParsed[3].lost}</td>
              </tr>
              <tr>
                <td>${countriesParsed[4].name}</td>
                <td>${countriesParsed[4].winned}</td>
                <td>${countriesParsed[4].lost}</td>
              </tr>
            </table>
          </div>
        </section>
        
        <button class="play-btn play-again">PLAY AGAIN!</button>
      </main>
    `);
  
    document.body.appendChild(gameOverScreen);
    
    nationalAnthem.play();

    var resetBtn = document.body.querySelector('.reset-btn');
    resetBtn.addEventListener('click', function() {     
      localStorage.removeItem('countries');
    });

    var playBtn = gameOverScreen.querySelector('.play-btn');
    playBtn.addEventListener('click', removeGameOverScreen);
  }

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
        return countriesInit[0]
      case 'France':
        return countriesInit[1]
      case 'New Zealand':
        return countriesInit[2]
      case 'Wales':
        return countriesInit[3]
      case 'South Africa':
        return countriesInit[4]
    }
  }
  // initialise Splash screen on initial start
  createSplashScreen();
}

// Runs the function `main` once all resources are loaded
window.addEventListener('load', main);