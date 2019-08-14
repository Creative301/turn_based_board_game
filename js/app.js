const rows = 10;
const cols = 10;
let playerOneX,
  playerOneY,
  playerTwoX,
  playerTwoY,
  playerOnePosition,
  playerTwoPosition,
  addBoxClass,
  playerOnePowerDOM,
  playerTwoPowerDOM,
  playerOneWeaponDOM,
  playerTwoWeaponDOM,
  playerOneDamageDOM,
  playerTwoDamageDOM,
  boardDiv,
  playerOneImg,
  playerTwoImg,
  versus,
  playerOneFight,
  playerTwoFight,
  playerOneFightButtons,
  playerTwoFightButtons,
  playerOneAttackButton,
  playerOneDefendButton,
  playerTwoAttackButton,
  playerTwoDefendButton;

addBoxClass = document.getElementsByClassName('col');
playerOnePowerDOM = document.getElementById('power_1');
playerTwoPowerDOM = document.getElementById('power_2');
playerOneWeaponDOM = document.getElementById('weapon_1');
playerTwoWeaponDOM = document.getElementById('weapon_2');
playerOneDamageDOM = document.getElementById('damage_1');
playerTwoDamageDOM = document.getElementById('damage_2');
boardDiv = document.getElementById('board');
playerOneImg = document.getElementById('player_1_Img');
playerTwoImg = document.getElementById('player_2_Img');
versus = document.getElementById('versus');
playerOneFight = document.getElementById('player_1_fight');
playerTwoFight = document.getElementById('player_2_fight');
playerOneFightButtons = document.getElementById('fight_buttons_1');
playerTwoFightButtons = document.getElementById('fight_buttons_2');
playerOneAttackButton = document.getElementById('attack_1');
playerOneDefendButton = document.getElementById('defend_1');
playerTwoAttackButton = document.getElementById('attack_2');
playerTwoDefendButton = document.getElementById('defend_2');

// Generate random number for the player position
let randomPositionNumbers = [];

let numberGenerator = function(arr) {
  if (arr.length > 3) return;
  let newNumber = Math.floor(Math.random() * rows);
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
console.log(playerOnePosition);
console.log(playerTwoPosition);

function drawBoard() {
  // Create the grid
  const grid = new Grid('#board', rows, cols);

  playerOnePowerDOM.textContent = playerOne.power;
  playerTwoPowerDOM.textContent = playerTwo.power;
  playerOneWeaponDOM.textContent = playerOne.weapon;
  playerTwoWeaponDOM.textContent = playerTwo.weapon;
  playerOneDamageDOM.textContent = playerOne.weaponDamage;
  playerTwoDamageDOM.textContent = playerTwo.weaponDamage;

  // Set the active player
  activePlayer = playerOne;
  passivePlayer = playerTwo;

  // Add box class for each col class
  for (let i = 0; i < addBoxClass.length; i++) {
    // console.log(addBoxClass[i]);
    addBoxClass[i].classList.add('box');
  }

  // Set the current player position
  currentRow = playerOneY;
  currentColumn = playerOneX;

  $('div').removeClass(
    'playerOneAllowed canMove adjacent playerOneActive playerTwoActive playerTurn weapon_1 weapon_2 weapon_3 weapon_4'
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
  adjacent();
  obstaclesAndWeapons(20, 4);
  disableMove();
}

// Player class
class Player {
  constructor(
    name,
    power,
    weapon,
    weaponDamage,
    activeBox,
    hoverBox,
    x,
    y,
    positionID
  ) {
    this.name = name;
    this.power = power;
    this.weapon = weapon;
    this.weaponDamage = weaponDamage;
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
let playerOne = new Player(
  'Maverick',
  100,
  'Laser',
  10,
  'playerOneActive',
  'playerOneAllowed',
  playerOneX,
  playerOneY,
  playerOnePosition
);

// Instantiate player two object
let playerTwo = new Player(
  'Viper',
  100,
  'Laser',
  10,
  'playerTwoActive',
  'playerTwoAllowed',
  playerTwoX,
  playerTwoY,
  playerTwoPosition
);

let numberOfRound, activePlayer, passivePlayer, box, winner, loser;
let boxes = document.getElementsByClassName('box');
let obstacles = [];

(function($, window, document) {
  $(function() {
    drawBoard();
  });
})(window.jQuery, window, document);
