// $(document).ready(function() {
//   drawBoard();
// });

(function($, window, document) {
  $(function() {
    drawBoard();
  });
})(window.jQuery, window, document);

let currentPlayer, inactivePlayer, cell, playerOnePosition, playerTwoPosition;
let addCellClass = document.querySelectorAll(".col");

function drawBoard() {
  // Create the grid
  const grid = new Grid("#board", 10, 10);

  // Set the active player
  currentPlayer = playerOne;
  inactivePlayer = playerTwo;

  // Add cell class for each col class
  addCellClass.forEach(function(cell) {
    cell.classList.add("cell");
  });

  // Get the current player one position
  currentRow = playerOne.position.y;
  currentColumn = playerOne.position.x;

  playerOnePosition = "#0_0";
  playerTwoPosition = "#9_9";

  // Add class to the active player and remove the cell class
  $(playerOnePosition)
    .addClass("playerOneActive playerTurn")
    .removeClass("cell");

  // Add class to the inactive player and remove the cell class
  $(playerTwoPosition)
    .addClass("playerTwoActive")
    .removeClass("cell");

  allowedtoMove();
}

// Player class
class Player {
  constructor(name, health, attack, activeCell, hoverCell, x, y, positionID) {
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.activeCell = activeCell;
    this.hoverCell = hoverCell;
    this.position = {
      x: x,
      y: y
    };
    this.positionID = positionID;
  }
}

// Instantiate player one object
const playerOne = new Player(
  "Maverick",
  100,
  10,
  "playerOneActive",
  "playerOneAllowed",
  0,
  0,
  "#0_0"
);

// Instantiate player two object
const playerTwo = new Player(
  "Viper",
  100,
  10,
  "playerTwoActive",
  "playerTwoAllowed",
  9,
  9,
  "#9_9"
);
