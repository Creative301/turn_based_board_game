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

    $board.on('click', '.canMove', movement);
  }
}

let cantMove = [];

// Player movement
function movement() {
  selectCol = $(this).data('col');
  selectRow = $(this).data('row');
  selectedColRow = `#${selectCol}_${selectRow}`;

  // Remove the player active class when the player move to another box
  $(activePlayer.positionID).removeClass(activePlayer.activeBox);
  // activeBox = playerOneActive
  // console.log(activePlayer.activeBox);

  // Remove the player allowed class when the player move to another box
  $(this).removeClass(activePlayer.hoverBox);
  // hoverBox = playerOneAllowed
  // console.log(activePlayer.hoverBox);

  $(this).removeClass('canMove');
  // Show the player on the new box that was clicked
  $(this).addClass(activePlayer.activeBox);
  // console.log(activePlayer.activeBox);

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

  // Add weapon
  if ($(this).hasClass('weapon_1')) {
    $('.weapon_1').css('background', '');
    activePlayer.weapon = 'Pipe';
    activePlayer.weaponDamage = 15;
    console.log(activePlayer.weaponDamage);
    if (activePlayer === playerOne) {
      playerOneWeaponDOM.textContent = playerOne.weapon;
      playerOneDamageDOM.textContent = playerOne.weaponDamage;
    }
    if (activePlayer === playerTwo) {
      playerTwoWeaponDOM.textContent = playerTwo.weapon;
      playerTwoDamageDOM.textContent = playerTwo.weaponDamage;
    }
  } else if ($(this).hasClass('weapon_2')) {
    $('.weapon_2').css('background', '');
    activePlayer.weapon = 'Reinforced Pipe';
    activePlayer.weaponDamage = 20;
    console.log(activePlayer.weaponDamage);
    if (activePlayer === playerOne) {
      playerOneWeaponDOM.textContent = playerOne.weapon;
      playerOneDamageDOM.textContent = playerOne.weaponDamage;
    }
    if (activePlayer === playerTwo) {
      playerTwoWeaponDOM.textContent = playerTwo.weapon;
      playerTwoDamageDOM.textContent = playerTwo.weaponDamage;
    }
  } else if ($(this).hasClass('weapon_3')) {
    $('.weapon_3').css('background', '');
    activePlayer.weapon = 'Metal';
    activePlayer.weaponDamage = 25;
    console.log(activePlayer.weaponDamage);
    if (activePlayer === playerOne) {
      playerOneWeaponDOM.textContent = playerOne.weapon;
      playerOneDamageDOM.textContent = playerOne.weaponDamage;
    }
    if (activePlayer === playerTwo) {
      playerTwoWeaponDOM.textContent = playerTwo.weapon;
      playerTwoDamageDOM.textContent = playerTwo.weaponDamage;
    }
  } else if ($(this).hasClass('weapon_4')) {
    $('.weapon_4').css('background', '');
    activePlayer.weapon = 'Barrel';
    activePlayer.weaponDamage = 30;
    console.log(activePlayer.weaponDamage);
    if (activePlayer === playerOne) {
      playerOneWeaponDOM.textContent = playerOne.weapon;
      playerOneDamageDOM.textContent = playerOne.weaponDamage;
    }
    if (activePlayer === playerTwo) {
      playerTwoWeaponDOM.textContent = playerTwo.weapon;
      playerTwoDamageDOM.textContent = playerTwo.weaponDamage;
    }
  }

  switchPlayer();

  currentColumn = activePlayer.position.x;
  currentRow = activePlayer.position.y;

  allowedtoMove();
  adjacent();
  disableMove();
  $(`${playerOnePosition}`).removeClass('canMove');
  $(`${playerTwoPosition}`).removeClass('canMove');
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

  allowedBoxes.forEach(function(box) {
    if (!box.hasClass('obstacles')) {
      box.addClass('canMove');
    }
  });
}

// Adjacent position
function adjacent() {
  let adjacentBoxes = [
    $(`#${currentColumn + 1}_${currentRow - 1}`),
    $(`#${currentColumn}_${currentRow - 1}`),
    $(`#${currentColumn - 1}_${currentRow - 1}`),
    $(`#${currentColumn - 1}_${currentRow}`),
    $(`#${currentColumn}_${currentRow + 1}`),
    $(`#${currentColumn + 1}_${currentRow}`),
    $(`#${currentColumn + 1}_${currentRow + 1}`)
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
  // console.log(cantMove);

  let boxesWithoutObstacles = [...boxes];
  // console.log(boxesWithoutObstacles.length);

  let weaponImages = [
    '../img/w1_pipe.png',
    '../img/w2_pipeStand.png',
    '../img/w3_metal.png',
    '../img/w4_barrel.png'
  ];

  // Add weapon class
  for (let i = 0; i < weapons; i++) {
    let weaponsId = ['w_1', 'w_2', 'w_3', 'w_4'];
    let weapons = ['weapon_1', 'weapon_2', 'weapon_3', 'weapon_4'];

    let generateRandomNumber = Math.floor(
      Math.random() * boxesWithoutObstacles.length
    );

    let addWeapons = boxesWithoutObstacles[generateRandomNumber];
    addWeapons.classList.add('weapon');
    addWeapons.classList.add(weapons[i]);

    boxesWithoutObstacles.splice(generateRandomNumber, 1);
  }

  // Show weapons on the board
  document.querySelector('.weapon_1').style.backgroundImage = `url(
    ${weaponImages[0]}
  )`;

  document.querySelector('.weapon_2').style.backgroundImage = `url(
    ${weaponImages[1]}
  )`;

  document.querySelector('.weapon_3').style.backgroundImage = `url(
    ${weaponImages[2]}
  )`;

  document.querySelector('.weapon_4').style.backgroundImage = `url(
    ${weaponImages[3]}
  )`;
}
