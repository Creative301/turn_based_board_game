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
        $(this).addClass(currentPlayer.hoverBox);
      }
    });

    $board.on('mouseleave', '.col.vacant', function() {
      $(this).removeClass('onHover');
      if ($(this).hasClass('canMove')) {
        $(this).removeClass(currentPlayer.hoverBox);
      }
    });

    $board.on('click', '.canMove', movement);
  }
}

// Player movement
function movement() {
  selectRow = $(this).data('row');
  selectCol = $(this).data('col');
  selectedColRow = `#${selectCol}_${selectRow}`;

  // Remove the player active class
  $(currentPlayer.positionID).removeClass(currentPlayer.activeBox);
  // console.log(currentPlayer.activeBox);

  // Remove the player allowed class
  $(this).removeClass(currentPlayer.hoverBox);
  // console.log(currentPlayer.hoverBox);

  $(this).removeClass('canMove');

  // Show the player on the new box that was clicked
  $(this).addClass(currentPlayer.activeBox);
  $(this).addClass('playerOneActive');

  currentPlayer.position.x = $(this).data('col');
  currentPlayer.position.y = $(this).data('row');

  currentPlayer.positionID = `#${currentPlayer.position.x}_${
    currentPlayer.position.y
  }`;

  playerOnePosition = `#${playerOne.position.x}_${playerOne.position.y}`;

  // console.log(selectedColRow);
  // console.log(currentPlayer.hoverBox);
  console.log(playerOnePosition);
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
    box.addClass('canMove');
    box.removeClass('box');
  });
}

// Create obstacles and weapons
function obstaclesAndWeapons(obstacles) {
  let sumObstacles = obstacles;
  let blockedBoxes = [];
  // boxes = document.getElementsByClassName("box");
  for (let i = 0; i < sumObstacles; i++) {
    let generateRandomNumber = Math.floor(Math.random() * boxes.length);

    let addObstacles = boxes[generateRandomNumber];

    addObstacles.classList.add('obstacles');
    addObstacles.classList.remove('box', 'vacant', 'canMove');

    blockedBoxes.push(addObstacles.id);
  }

  console.log(blockedBoxes);
}
