// Width and height
const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

// Figures
const TETROMINO_NAMES = ['O', 'L', 'J', 'I', 'S', 'Z', 'T'];

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
		const div = document.createElement('div');
		document.querySelector('.tetris').append(div);
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
	const columnTetro =
		PLAYFIELD_COLUMNS / 2 - Math.floor(matrixTetro.length / 2);
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

// Get the div's
const cells = document.querySelectorAll('.tetris div');

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

// Position of the figure
function convertPositionToIndex(row, column) {
	return row * PLAYFIELD_COLUMNS + column;
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

drawTetromino();

// Draw the new position for the figure
function draw() {
	cells.forEach(function (cell) {
		cell.removeAttribute('class');
	});
	drawPlayfield();
	drawTetromino();
	// console.table(playfield);
}

// Place figure down
function placeTetromino() {
	const matrixSize = tetromino.matrix.length;
	for (let row = 0; row < matrixSize; row++) {
		for (let column = 0; column < matrixSize; column++) {
			if (!tetromino.matrix[row][column]) continue;
			playfield[tetromino.row + row][tetromino.column + column] =
				tetromino.name;
		}
	}
	const filledRows = findFilledRows();
	// console.log(filledRows);
	removeFilledRows(filledRows);
	generateTetromino();
}

// Delete filler rows
function removeFilledRows(filledRows) {
	filledRows.forEach(row => {
		dropRowsAbove(row);
	});
}

function dropRowsAbove(rowToDelete) {
	for (let row = rowToDelete; row > 0; row--) {
		playfield[row] = playfield[row - 1];
	}
	// Add new column after delete
	playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}

// Find filler rows
function findFilledRows() {
	const filledRows = [];
	for (let row = 0; row < PLAYFIELD_ROWS; row++) {
		let filledColumns = 0;
		for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
			if (playfield[row][column] != 0) {
				filledColumns++;
			}
		}
		if (PLAYFIELD_COLUMNS == filledColumns) {
			filledRows.push(row);
		}
	}
	return filledRows;
}

// Control the figure
document.addEventListener('keydown', onKeyDown);

function onKeyDown(event) {
	switch (event.key) {
		case 'ArrowDown':
		case ' ':
			moveTetrominoDown();
			break;

		case 'ArrowUp':
			rotateTetromino();
			break;

		case 'ArrowLeft':
			moveTetrominoLeft();
			break;

		case 'ArrowRight':
			moveTetrominoRight();
			break;
	}
	draw();
}

// Move down
function moveTetrominoDown() {
	tetromino.row += 1;
	if (isValid()) {
		tetromino.row -= 1;
		placeTetromino();
	}
}

// Rotate figure
function rotateTetromino() {
	const oldMatrix = tetromino.matrix;
	const rotatedMatrix = rotateMatrix(tetromino.matrix);
	tetromino.matrix = rotatedMatrix;
	if (isValid()) {
		tetromino.matrix = oldMatrix;
	}
}

// TODO rotate I,S and Z other way
function rotateMatrix(matrix) {
	const N = matrix.length;
	const rotatedMatrix = [];
	for (let i = 0; i < N; i++) {
		rotatedMatrix[i] = [];
		for (let j = 0; j < N; j++) {
			rotatedMatrix[i][j] = matrix[N - j - 1][i];
			// rotatedMatrix[i][j] = matrix[j][matrix[0].length - i - 1];
		}
	}
	return rotatedMatrix;
}

// Move left
function moveTetrominoLeft() {
	tetromino.column -= 1;
	if (isValid()) {
		tetromino.column += 1;
	}
}

// Move right
function moveTetrominoRight() {
	tetromino.column += 1;
	if (isValid()) {
		tetromino.column -= 1;
	}
}

// Restricting movement the figure on the field and collision
function isValid() {
	const matrixSize = tetromino.matrix.length;
	for (let row = 0; row < matrixSize; row++) {
		for (let column = 0; column < matrixSize; column++) {
			if (tetromino.matrix[row][column] == 0) {
				continue;
			}
			if (isOutsideOfGameBoard(row, column)) {
				return true;
			}
			if (hasColisions(row, column)) {
				return true;
			}
		}
	}
	return false;
}

// Restricting movement the figure on the field
function isOutsideOfGameBoard(row, column) {
	return (
		tetromino.column + column < 0 ||
		tetromino.column + column >= PLAYFIELD_COLUMNS ||
		tetromino.row + row >= PLAYFIELD_ROWS
	);
}

// Restricting colision
function hasColisions(row, column) {
	return playfield[tetromino.row + row][tetromino.column + column];
}
