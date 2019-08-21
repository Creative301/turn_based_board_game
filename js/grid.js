const rows = 10;
const cols = 10;
let weapons = [];
let cantMove = [];
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

class Grid {
  constructor(selector, rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.selector = selector;
    this.createGrid();
    this.setupEventListeners();
  }

  // Create the grid
  createGrid() {
    const $board = $(this.selector);
    for (let row = 0; row < this.rows; row++) {
      const $row = $('<div>').addClass('row');
      for (let col = 0; col < this.cols; col++) {
        const $col = $('<div>')
          .addClass('col box vacant vacantBox')
          .attr('data-col', col)
          .attr('data-row', row)
          .attr('id', col + '_' + row);
        $row.append($col);
      }
      $board.append($row);
    }
  }

  // Event listener for the board
  setupEventListeners() {
    const $board = $(this.selector);

    $board.on('mouseenter', '.col.vacant', function() {
      $(this).addClass('onHover');
      if ($(this).hasClass('canMove')) {
        $(this).addClass(activePlayer.hoverBox);
      }
    });

    $board.on('mouseleave', '.col.vacant', function() {
      $(this).removeClass('onHover');
      if ($(this).hasClass('canMove')) {
        $(this).removeClass(activePlayer.hoverBox);
      }
    });

    // Limit the player movement
    $board.on('click', '.canMove', movement);
  }
}

class Weapon {
  constructor(name, src, damage, cssClass) {
    this.name = name;
    this.src = src;
    this.damage = damage;
    this.cssClass = cssClass;
    weapons.push(this);
  }
}

let weapon_1 = new Weapon('Pipe', 'img/w1_pipe.png', 15, 'weapon_1');
let weapon_2 = new Weapon('Reinforced Pipe', 'img/w2_pipeStand.png', 20, 'weapon_2');
let weapon_3 = new Weapon('Metal', 'img/w3_metal.png', 25, 'weapon_3');
let weapon_4 = new Weapon('Barrel', 'img/w4_barrel.png', 30, 'weapon_4');

// console.log(weapons);

// Player movement
function movement() {
  // console.log(activePlayer);

  selectCol = $(this).data('col');
  selectRow = $(this).data('row');
  selectedColRow = `#${selectCol}_${selectRow}`;

  oldPosition = activePlayer.getCurrentPosition();
  newPosition = $(this).index('.col');

  // Remove the player active class when the player move to another box
  $(activePlayer.positionID).removeClass(activePlayer.activeBox);

  // Remove the player allowed class when the player move to another box
  $(this).removeClass(activePlayer.hoverBox);

  // Show the player on the new box that was clicked
  $(this).addClass(activePlayer.activeBox);

  // Remove canMove class when the player switch
  $('div').removeClass('onHover canMove adjacent');

  // Switch active class
  $(activePlayer.positionID).removeClass('playerTurn');
  $(passivePlayer.positionID).addClass('playerTurn');
  activePlayer.position.x = $(this).data('col');
  activePlayer.position.y = $(this).data('row');

  activePlayer.positionID = `#${activePlayer.position.x}_${activePlayer.position.y}`;

  playerOnePosition = `#${playerOne.position.x}_${playerOne.position.y}`;
  playerTwoPosition = `#${playerTwo.position.x}_${playerTwo.position.y}`;

  switchPlayer();

  currentColumn = activePlayer.position.x;
  currentRow = activePlayer.position.y;

  allowedtoMove();
  adjacent();
  disableMove();

  // Check weapon position
  if (newPosition - oldPosition < 4 && newPosition - oldPosition > 0) {
    // console.log('Right');
    for (i = 1; i <= newPosition - oldPosition; i++) {
      checkWeapons(activePlayer, oldPosition + i);
    }
  } else if (newPosition - oldPosition < 0 && newPosition - oldPosition > -4) {
    // console.log('Left');
    for (i = -1; i >= newPosition - oldPosition; i--) {
      checkWeapons(activePlayer, oldPosition + i);
    }
  } else if (newPosition - oldPosition >= cols) {
    // console.log('Down');
    for (i = cols; i <= newPosition - oldPosition; i += cols) {
      checkWeapons(activePlayer, oldPosition + i);
    }
  } else {
    // console.log('Up');
    for (i = -cols; i >= newPosition - oldPosition; i -= cols) {
      checkWeapons(activePlayer, oldPosition + i);
    }
  }

  $(`${playerOnePosition}`).removeClass('canMove');
  $(`${playerTwoPosition}`).removeClass('canMove');

  // Fight if the players position are adjacent
  if ($(this).hasClass('adjacent')) {
    switchPlayerForFight();
    fight();
  }
}

// Switch the player
function switchPlayer() {
  if (activePlayer === playerOne) {
    activePlayer = playerTwo;
    passivePlayer = playerOne;
  } else {
    activePlayer = playerOne;
    passivePlayer = playerTwo;
  }
}

// Switch the player for fight
function switchPlayerForFight() {
  if (passivePlayer === playerOne) {
    activePlayer = playerOne;
    passivePlayer = playerTwo;
  } else {
    activePlayer = playerTwo;
    passivePlayer = playerOne;
  }
}

// Add a weapon when the player moved over to a new box with a weapon class
function checkWeapons(player, position) {
  $.each(weapons, function(index, weapon) {
    if ($('.col:eq(' + position + ')').hasClass(weapon.cssClass)) {
      $('.col:eq(' + position + ')')
        .removeClass(weapon.cssClass)
        .removeClass('weapon')
        .css('background', '');
      // console.log('true');

      // Update the player data to match the new weapon
      if (player === playerOne) {
        playerTwo.currentWeapon = weapon.name;
        playerTwo.weaponDamage = weapon.damage;
        playerTwoWeaponDOM.textContent = playerTwo.currentWeapon;
        playerTwoDamageDOM.textContent = weapon.damage;
        console.log(playerTwo.weapon);
      } else {
        playerOne.currentWeapon = weapon.name;
        playerOne.weaponDamage = weapon.damage;
        playerOneDamageDOM.textContent = weapon.damage;
        playerOneWeaponDOM.textContent = playerOne.currentWeapon;
        // console.log(playerOne.weapon);
      }
      return false;
    }
  });
}

// Limit the player movement
function allowedtoMove() {
  /* Limit movement to 3 columns and 3 rows 
  Horizontal and vertical */
  let allowedBoxes = [
    $(`#${currentColumn - 1}_${currentRow}`),
    $(`#${currentColumn - 2}_${currentRow}`),
    $(`#${currentColumn - 3}_${currentRow}`),
    $(`#${currentColumn + 1}_${currentRow}`),
    $(`#${currentColumn + 2}_${currentRow}`),
    $(`#${currentColumn + 3}_${currentRow}`),
    $(`#${currentColumn}_${currentRow - 1}`),
    $(`#${currentColumn}_${currentRow - 2}`),
    $(`#${currentColumn}_${currentRow - 3}`),
    $(`#${currentColumn}_${currentRow + 1}`),
    $(`#${currentColumn}_${currentRow + 2}`),
    $(`#${currentColumn}_${currentRow + 3}`)
  ];

  // Check if the player move over a box that contain a weapon
  allowedBoxes.forEach(function(box) {
    if (!box.hasClass('obstacles')) {
      box.addClass('canMove');
    }
  });
}

// Get the adjacent position
function adjacent() {
  let adjacentBoxes = [
    $(`#${currentColumn}_${currentRow - 1}`), // top
    $(`#${currentColumn - 1}_${currentRow}`), // left
    $(`#${currentColumn}_${currentRow + 1}`), // bottom
    $(`#${currentColumn + 1}_${currentRow}`) // right
  ];

  adjacentBoxes.forEach(function(box) {
    box.addClass('adjacent');
  });
}

// Disable player movement after obstacle
function disableMove() {
  if (cantMove.includes(currentColumn + '_' + (currentRow - 1))) {
    $(`#${currentColumn}_${currentRow - 2}`).removeClass('canMove');
    $(`#${currentColumn}_${currentRow - 3}`).removeClass('canMove');
  }

  if (cantMove.includes(currentColumn + '_' + (currentRow - 2))) {
    $(`#${currentColumn}_${currentRow - 3}`).removeClass('canMove');
  }

  if (
    cantMove.includes(currentColumn + '_' + (currentRow - 1)) &&
    cantMove.includes(currentColumn + 1 + '_' + (currentRow - 1))
  ) {
    $(`#${currentColumn}_${currentRow - 2}`).removeClass('canMove');
    $(`#${currentColumn + 1}_${currentRow - 2}`).removeClass('canMove');
    $(`#${currentColumn + 2}_${currentRow - 2}`).removeClass('canMove');
  }

  if (cantMove.includes(currentColumn + 1 + '_' + (currentRow - 1))) {
    $(`#${currentColumn + 2}_${currentRow - 2}`).removeClass('canMove');
  }

  if (
    cantMove.includes(currentColumn + 1 + '_' + (currentRow - 1)) &&
    cantMove.includes(currentColumn + 1 + '_' + currentRow)
  ) {
    $(`#${currentColumn + 2}_${currentRow - 2}`).removeClass('canMove');
    $(`#${currentColumn + 2}_${currentRow}`).removeClass('canMove');
    $(`#${currentColumn + 2}_${currentRow - 1}`).removeClass('canMove');
  }

  if (cantMove.includes(currentColumn + 1 + '_' + currentRow)) {
    $(`#${currentColumn + 2}_${currentRow}`).removeClass('canMove');
    $(`#${currentColumn + 3}_${currentRow}`).removeClass('canMove');
  }

  if (cantMove.includes(currentColumn + 2 + '_' + currentRow)) {
    $(`#${currentColumn + 3}_${currentRow}`).removeClass('canMove');
  }

  if (
    cantMove.includes(currentColumn + 1 + '_' + currentRow) &&
    cantMove.includes(currentColumn + 1 + '_' + (currentRow + 1))
  ) {
    $(`#${currentColumn + 2}_${currentRow}`).removeClass('canMove');
    $(`#${currentColumn + 2}_${currentRow + 2}`).removeClass('canMove');
    $(`#${currentColumn + 2}_${currentRow + 1}`).removeClass('canMove');
  }

  if (cantMove.includes(currentColumn + 1 + '_' + (currentRow + 1))) {
    $(`#${currentColumn + 2}_${currentRow + 2}`).removeClass('canMove');
  }

  if (
    cantMove.includes(currentColumn + '_' + (currentRow + 1)) &&
    cantMove.includes(currentColumn + 1 + '_' + (currentRow + 1))
  ) {
    $(`#${currentColumn + 1}_${currentRow + 2}`).removeClass('canMove');
    $(`#${currentColumn + 2}_${currentRow + 2}`).removeClass('canMove');
    $(`#${currentColumn}_${currentRow + 2}`).removeClass('canMove');
  }

  if (cantMove.includes(currentColumn + '_' + (currentRow + 1))) {
    $(`#${currentColumn}_${currentRow + 2}`).removeClass('canMove');
    $(`#${currentColumn}_${currentRow + 3}`).removeClass('canMove');
  }

  if (cantMove.includes(currentColumn + '_' + (currentRow + 2))) {
    $(`#${currentColumn}_${currentRow + 3}`).removeClass('canMove');
  }

  if (
    cantMove.includes(currentColumn + '_' + (currentRow + 1)) &&
    cantMove.includes(currentColumn - 1 + '_' + (currentRow + 1))
  ) {
    $(`#${currentColumn - 1}_${currentRow + 2}`).removeClass('canMove');
    $(`#${currentColumn}_${currentRow + 2}`).removeClass('canMove');
    $(`#${currentColumn - 2}_${currentRow + 2}`).removeClass('canMove');
  }

  if (cantMove.includes(currentColumn - 1 + '_' + (currentRow + 1))) {
    $(`#${currentColumn - 2}_${currentRow + 2}`).removeClass('canMove');
  }

  if (
    cantMove.includes(currentColumn - 1 + '_' + currentRow) &&
    cantMove.includes(currentColumn - 1 + '_' + (currentRow + 1))
  ) {
    $(`#${currentColumn - 2}_${currentRow}`).removeClass('canMove');
    $(`#${currentColumn - 2}_${currentRow + 1}`).removeClass('canMove');
    $(`#${currentColumn - 2}_${currentRow + 2}`).removeClass('canMove');
  }

  if (cantMove.includes(currentColumn - 1 + '_' + currentRow)) {
    $(`#${currentColumn - 2}_${currentRow}`).removeClass('canMove');
    $(`#${currentColumn - 3}_${currentRow}`).removeClass('canMove');
  }

  if (cantMove.includes(currentColumn - 2 + '_' + currentRow)) {
    $(`#${currentColumn - 3}_${currentRow}`).removeClass('canMove');
  }

  if (
    cantMove.includes(currentColumn - 1 + '_' + currentRow) &&
    cantMove.includes(currentColumn - 1 + '_' + (currentRow + 1))
  ) {
    $(`#${currentColumn - 2}_${currentRow}`).removeClass('canMove');
    $(`#${currentColumn - 2}_${currentRow - 1}`).removeClass('canMove');
    $(`#${currentColumn - 2}_${currentRow - 2}`).removeClass('canMove');
  }

  if (cantMove.includes(currentColumn - 1 + '_' + (currentRow - 1))) {
    $(`#${currentColumn - 2}_${currentRow - 2}`).removeClass('canMove');
  }

  if (
    cantMove.includes(currentColumn + '_' + (currentRow - 1)) &&
    cantMove.includes(currentColumn - 1 + '_' + (currentRow - 1))
  ) {
    $(`#${currentColumn}_${currentRow - 2}`).removeClass('canMove');
    $(`#${currentColumn - 1}_${currentRow - 2}`).removeClass('canMove');
    $(`#${currentColumn - 2}_${currentRow - 2}`).removeClass('canMove');
  }
}

// Add obstacles and weapons
function obstaclesAndWeapons(obstacles, weapons) {
  // Add obstacles
  for (let i = 0; i < obstacles; i++) {
    let generateRandomNumber = Math.floor(Math.random() * boxes.length);

    let addObstacles = boxes[generateRandomNumber];

    addObstacles.classList.add('obstacles');
    addObstacles.classList.remove('box', 'vacant', 'canMove');

    cantMove.push(addObstacles.id);
  }

  let boxesWithoutObstacles = [...boxes];
  // console.log(boxesWithoutObstacles);

  // Add weapon
  for (let i = 0; i < weapons.length; i++) {
    let generateRandomNumber = Math.floor(
      Math.random() * boxesWithoutObstacles.length
    );

    let addWeapons = boxesWithoutObstacles[generateRandomNumber];
    addWeapons.classList.add('weapon');
    addWeapons.classList.add(weapons[i].cssClass);
    // console.log(weapons[i]);

    boxesWithoutObstacles.splice(generateRandomNumber, 1);
  }

  // Show weapons on the board
  document.querySelector('.weapon_1').style.backgroundImage = `url(
    ${weapons[0].src}
  )`;

  document.querySelector('.weapon_2').style.backgroundImage = `url(
    ${weapons[1].src}
  )`;

  document.querySelector('.weapon_3').style.backgroundImage = `url(
    ${weapons[2].src}
  )`;

  document.querySelector('.weapon_4').style.backgroundImage = `url(
    ${weapons[3].src}
  )`;
}

function fight() {
  boardDiv.style.display = 'none';
  playerOneImg.style.display = 'none';
  playerTwoImg.style.display = 'none';
  versus.style.display = 'block';
  playerOneFight.style.display = 'block';
  playerTwoFight.style.display = 'block';

  playerOneAttack();
  playerTwoAttack();
}

function playerOneAttack() {
  if (activePlayer === playerOne) {
    playerOneFightButtons.style.display = 'block';

    // Create own function
    function attackPlayerTwo() {
      // Check the opponent power
      playerOne.reduceOpponentPower(playerTwo);
      console.log(playerTwo.power);
      playerTwoPowerDOM.textContent = playerTwo.power;
      playerOneFightButtons.style.display = 'none';
      playerTwoFightButtons.style.display = 'block';
      activePlayer = playerTwo;
      passivePlayer = playerOne;
      // console.log(playerOne.weaponDamage);
      // Remove the event listener function
      playerOneAttackButton.removeEventListener('click', attackPlayerTwo, true);
      fight();
    }

    playerOneAttackButton.addEventListener('click', attackPlayerTwo, true);
  }
}

function playerTwoAttack() {
  if (activePlayer === playerTwo) {
    playerTwoFightButtons.style.display = 'block';

    function attackPlayerOne() {
      playerTwo.reduceOpponentPower(playerOne);
      console.log(playerOne.power);
      playerOnePowerDOM.textContent = playerOne.power;
      playerTwoFightButtons.style.display = 'none';
      playerOneFightButtons.style.display = 'block';
      activePlayer = playerOne;
      passivePlayer = playerTwo;
      // console.log(playerTwo.weaponDamage);
      playerTwoAttackButton.removeEventListener('click', attackPlayerOne, true);
      fight();
    }

    playerTwoAttackButton.addEventListener('click', attackPlayerOne, true);
  }
}

// Optimization to store event listener
// has listener  true or false

// css transition
// remove event listener
