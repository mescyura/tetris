// Width and height
const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

// Figures
const TETROMINO_NAMES = ["O", "L", "J", "I", "S", "Z", "T"];

const TETROMINOES = {
  O: [
    [1, 1],
    [1, 1],
  ],

  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],

  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],

  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],

  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],

  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],

  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

// Field and figure
let playfield;
let tetromino;

// Create field
function generatePlayField() {
  for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
    const div = document.createElement("div");
    document.querySelector(".tetris").append(div);
  }

  playfield = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
}

// Create figure
function generateTetromino() {
  let figure = Math.floor(Math.random() * TETROMINO_NAMES.length);
  const nameTetro = TETROMINO_NAMES[figure];
  const matrixTetro = TETROMINOES[nameTetro];
  const columnTetro = 4;
  const rowTetro = 0;

  tetromino = {
    name: nameTetro,
    matrix: matrixTetro,
    column: columnTetro,
    row: rowTetro,
  };
}

generatePlayField();
generateTetromino();

const cells = document.querySelectorAll(".tetris div");

// Draw the figure after the figure reaches the bottom
function drawPlayfield() {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      //   if (playfield[row][column] == 0) {
      //     continue;
      //   }
      const name = playfield[row][column];
      const cellIndex = convertPositionToIndex(row, column);
      if (name != 0) {
        cells[cellIndex].classList.add(name);
      }
    }
  }
}

// Draw the figure
function drawTetromino() {
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (tetromino.matrix[row][column] == 0) {
        continue;
      }
      const cellIndex = convertPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );
      cells[cellIndex].classList.add(name);
    }
  }
}

// Position of the figure
function convertPositionToIndex(row, column) {
  return row * PLAYFIELD_COLUMNS + column;
}

drawTetromino();

// Draw the new position for the figure
function draw() {
  cells.forEach(function (cell) {
    cell.removeAttribute("class");
  });
  drawPlayfield();
  drawTetromino();
}

document.addEventListener("keydown", onKeyDown);

// Control the figure
function onKeyDown(event) {
  switch (event.key) {
    case "ArrowDown":
    case " ":
      moveTetrominoDown();
      break;

    case "ArrowUp":
      moveTetrominoUp();
      break;

    case "ArrowLeft":
      moveTetrominoLeft();
      break;

    case "ArrowRight":
      moveTetrominoRight();
      break;
  }
  draw();
}

function moveTetrominoDown() {
  tetromino.row += 1;
  if (isOutsideOfGameBoard()) {
    tetromino.row -= 1;
    placeTetromino();
  }
}

function moveTetrominoLeft() {
  tetromino.column -= 1;
  if (isOutsideOfGameBoard()) {
    tetromino.column += 1;
  }
}

function moveTetrominoRight() {
  tetromino.column += 1;
  if (isOutsideOfGameBoard()) {
    tetromino.column -= 1;
  }
}

// delete
function moveTetrominoUp() {
  tetromino.row -= 1;
}

// Restricting movement the figure on the field
function isOutsideOfGameBoard() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (tetromino.matrix[row][column] == 0) {
        continue;
      }
      if (
        tetromino.column + column < 0 ||
        tetromino.column + column >= PLAYFIELD_COLUMNS ||
        tetromino.row + row >= PLAYFIELD_ROWS
      ) {
        return true;
      }
    }
  }
  return false;
}

function placeTetromino() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) continue;
      playfield[tetromino.row + row][tetromino.column + column] =
        tetromino.name;
    }
  }

  generateTetromino();
}
