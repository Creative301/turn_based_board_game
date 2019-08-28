addBoxClass = $('.col');
playerOnePowerDOM = $('#power_1');
playerTwoPowerDOM = $('#power_2');
playerOneWeaponDOM = $('#weapon_1');
playerTwoWeaponDOM = $('#weapon_2');
playerOneDamageDOM = $('#damage_1');
playerTwoDamageDOM = $('#damage_2');
playerOneFightButtons = $('#fight_buttons_1');
playerTwoFightButtons = $('#fight_buttons_2');
playerOneAttackButton = $('#attack_1');
playerOneDefendButton = $('#defend_1');
playerTwoAttackButton = $('#attack_2');
playerTwoDefendButton = $('#defend_2');

let playerOneSrc = 'img/playerOneWin.png';
let playerTwoSrc = 'img/playerTwoWin.png';
let activePlayer, passivePlayer;
let obstacles = [];

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

function drawBoard() {
  // Create the grid
  const grid = new Grid('#board', rows, cols);

  // Add box class for each col class
  for (let i = 0; i < addBoxClass.length; i++) {
    addBoxClass[i].addClass('box');
  }
}

// Player class
class Player {
  constructor(
    src,
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
    this.src = src;
    this.name = name;
    this.power = power;
    this.weapon = weapon;
    this.weaponDamage = weaponDamage;
    this.currentWeapon = '';
    this.oldWeapon = '';
    this.activeBox = activeBox;
    this.hoverBox = hoverBox;
    this.position = {
      x: x,
      y: y
    };
    this.positionID = positionID;
  }

  getCurrentPosition() {
    return $('.' + this.activeBox).index('.col');
  }

  resetPlayerData() {
    this.currentWeapon = '';
    this.power = 100;
    this.weaponDamage = 10;
  }

  reduceOpponentPower(player) {
    // check the player power
    return (player.power -= this.weaponDamage);
  }
}

// Instantiate player one object
let playerOne = new Player(
  playerOneSrc,
  'Maverick',
  100,
  'laser',
  10,
  'playerOneActive',
  'playerOneAllowed',
  playerOneX,
  playerOneY,
  playerOnePosition
);

// Instantiate player two object
let playerTwo = new Player(
  playerTwoSrc,
  'Viper',
  100,
  'laser',
  10,
  'playerTwoActive',
  'playerTwoAllowed',
  playerTwoX,
  playerTwoY,
  playerTwoPosition
);

let boxes = document.getElementsByClassName('box');

function playAgain() {
  console.log('play again');

  $('#playAgainBtn').on('click', function() {
    $('#winner').remove();
    $('.row').remove();
    drawBoard();
    init();
  });
}

// seperate the function
function init() {
  // Reset the player data
  playerOne.resetPlayerData();
  playerTwo.resetPlayerData();

  $('div').removeClass(
    'playerOneAllowed canMove adjacent playerOneActive playerTwoActive playerTurn pipe antenna metal barrel'
  );

  playerOnePowerDOM.text(playerOne.power);
  playerTwoPowerDOM.text(playerTwo.power);
  playerOneWeaponDOM.text(playerOne.weapon);
  playerTwoWeaponDOM.text(playerTwo.weapon);
  playerOneDamageDOM.text(playerOne.weaponDamage);
  playerTwoDamageDOM.text(playerTwo.weaponDamage);

  // Set the active player
  activePlayer = playerOne;
  passivePlayer = playerTwo;

  // Set the current player position
  currentRow = playerOneY;
  currentColumn = playerOneX;

  // $('div').removeClass(
  //   'playerOneAllowed canMove adjacent playerOneActive playerTwoActive playerTurn pipe antenna metal barrel'
  // );

  $('div', '#board').addClass('vacant');

  $('#board').css('display', 'block');
  $('#player_1_Img').css('display', 'block');
  $('#player_2_Img').css('display', 'block');
  $('#versus').css('display', 'none');
  $('#player_1_fight').css('display', 'none');
  $('#player_2_fight').css('display', 'none');

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
  obstaclesAndWeapons(10, weapons);
  disableMove();
}

(function($, window, document) {
  $(function() {
    drawBoard();
    init();
  });
})(window.jQuery, window, document);
