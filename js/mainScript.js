(function($, window, document) {
  $(function() {
    drawBoard();
  });
})(window.jQuery, window, document);

const rows = 10;
const cols = 10;
let playerOneX,
  playerOneY,
  playerTwoX,
  playerTwoY,
  playerOnePosition,
  playerTwoPosition;
// currentColumn,
// currentRow;
let addBoxClass = document.getElementsByClassName('col');

// Generate random number for the player position
let randomPositionNumbers = [];

let numberGenerator = function(arr) {
  if (arr.length > 3) return;
  let newNumber = Math.floor(Math.random() * rows + 1);
  if (arr.indexOf(newNumber) < 0) {
    arr.push(newNumber);
  }
  numberGenerator(arr);
};
numberGenerator(randomPositionNumbers);

// Player position
playerOneX = randomPositionNumbers[0];
playerOneY = randomPositionNumbers[1];
playerTwoX = randomPositionNumbers[2];
playerTwoY = randomPositionNumbers[3];

playerOnePosition = `#${playerOneX}_${playerOneY}`;
playerTwoPosition = `#${playerTwoX}_${playerTwoY}`;

function drawBoard() {
  // Create the grid
  const grid = new Grid('#board', rows, cols);

  // Set the active player
  currentPlayer = playerOne;
  inactivePlayer = playerTwo;

  // Add box class for each col class
  for (let i = 0; i < addBoxClass.length; i++) {
    // console.log(addBoxClass[i]);
    addBoxClass[i].classList.add('box');
  }

  // Get the current player one position
  currentRow = playerOneY;
  currentColumn = playerOneX;
  // console.log(currentColumn);

  $('div').removeClass(
    'playerOneAllowed canMove playerOneActive playerTwoActive playerTurn weapon_1 weapon_2 weapon_3 weapon_4'
  );
  $('div', '#board').addClass('vacant');

  // Add class to the active player and remove the box class
  $(playerOnePosition)
    .addClass('playerOneActive playerTurn')
    .removeClass('box');

  // Add class to the inactive player and remove the box class
  $(playerTwoPosition)
    .addClass('playerTwoActive')
    .removeClass('box');

  allowedtoMove();
  obstaclesAndWeapons(30, 4);
  disableMove();
}

// Player class
class Player {
  constructor(name, power, weapon, activeBox, hoverBox, x, y, positionID) {
    this.name = name;
    this.power = power;
    this.weapon = weapon;
    this.activeBox = activeBox;
    this.hoverBox = hoverBox;
    this.position = {
      x: x,
      y: y
    };
    this.positionID = positionID;
  }
}

// Instantiate player one object
const playerOne = new Player(
  'Maverick',
  100,
  10,
  'playerOneActive',
  'playerOneAllowed',
  playerOneX,
  playerOneY,
  playerOnePosition
);

// Instantiate player two object
const playerTwo = new Player(
  'Viper',
  100,
  10,
  'playerTwoActive',
  'playerTwoAllowed',
  playerTwoX,
  playerTwoY,
  playerTwoPosition
);

let numberOfRound, currentPlayer, inactivePlayer, box, winner, loser;
let boxes = document.getElementsByClassName('box');
let obstacles = [];
// let cantMove = [];
// console.log(cantMove);
