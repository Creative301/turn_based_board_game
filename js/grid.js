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
      const $row = $("<div>").addClass("row");
      for (let col = 0; col < this.cols; col++) {
        const $col = $("<div>")
          .addClass("col vacant cell vacantCell")
          .attr("data-col", col)
          .attr("data-row", row)
          .attr("id", col + "_" + row);
        $row.append($col);
      }
      $board.append($row);
    }
  }

  // Event listener for the board
  setupEventListeners() {
    const $board = $(this.selector);

    $board.on("mouseenter", ".col.vacant", function() {
      $(this).addClass("onHover");
      if ($(this).hasClass("canMove")) {
        $(this).addClass(currentPlayer.hoverCell);
      }
    });

    $board.on("mouseleave", ".col.vacant", function() {
      $(this).removeClass("onHover");
      if ($(this).hasClass("canMove")) {
        $(this).removeClass(currentPlayer.hoverCell);
      }
    });

    $board.on("click", ".canMove", movement);
  }
}

// Player movement
function movement() {
  selectRow = $(this).data("row");
  selectCol = $(this).data("col");
  selectedColRow = `#${selectCol}_${selectRow}`;

  // Remove the player active class
  $(currentPlayer.positionID).removeClass(currentPlayer.activeCell);
  // console.log(currentPlayer.activeCell);

  // Remove the player allowed class
  $(this).removeClass(currentPlayer.hoverCell);
  // console.log(currentPlayer.hoverCell);

  $(this).removeClass("canMove");

  // Show the player on the new cell that was clicked
  $(this).addClass(currentPlayer.activeCell);
  $(this).addClass("playerOneActive");

  currentPlayer.position.x = $(this).data("col");
  currentPlayer.position.y = $(this).data("row");

  currentPlayer.positionID = `#${currentPlayer.position.x}_${
    currentPlayer.position.y
  }`;

  playerOnePosition = `#${playerOne.position.x}_${playerOne.position.y}`;

  // console.log(selectedColRow);
  // console.log(currentPlayer.hoverCell);
  console.log(playerOnePosition);
}

// Limit the player movement
function allowedtoMove() {
  /* Limit movement to 3 columns and 3 rows 
  Horizontal and vertical */
  let allowedCells = [
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

  allowedCells.forEach(function(cell) {
    cell.addClass("canMove");
  });
}
