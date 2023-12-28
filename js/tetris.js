import {
	PLAYFIELD_COLUMNS,
	PLAYFIELD_ROWS,
	TETROMINO_NAMES,
	TETROMINOES,
	getRandomFigure,
	rotateMatrix,
	setHighScore,
} from './utilities.js';

import { onKeyDown, stopLoop } from './main.js';

export let playfield;
export let tetromino;
export let nextFigurePlayfield;
export let nextTetromino;
export let score = 0;
export let speed = 700;
export let speedDispday = 0;
export let isGameOver = false;

// Setters
export function setScore(value) {
	value == 0 ? (score = value) : (score += value);
}

export function setGameOver(value) {
	isGameOver = value;
}

export function setDefaultSpeed() {
	speed = 700;
}

export function setDefaultDisplaySpeed() {
	speedDispday = 0;
}

// Create field
export function generatePlayField() {
	document.querySelector('.tetris').innerHTML = '';
	for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
		const div = document.createElement('div');
		document.querySelector('.tetris').append(div);
	}

	playfield = new Array(PLAYFIELD_ROWS)
		.fill()
		.map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
}

// Create figure
export function generateTetromino() {
	const nameTetro = getRandomFigure(TETROMINO_NAMES);
	const matrixTetro = TETROMINOES[nameTetro];
	const columnTetro =
		PLAYFIELD_COLUMNS / 2 - Math.floor(matrixTetro.length / 2);
	const rowTetro = -2;

	tetromino = {
		name: nameTetro,
		matrix: matrixTetro,
		column: columnTetro,
		row: rowTetro,
		dropColumn: columnTetro,
		dropRow: rowTetro,
	};

	calculateDropPosition();
}

// Drop figure down
export function dropTetrominoDown() {
	tetromino.row = tetromino.dropRow;
	placeTetromino();
}

// Move figure down
export function moveTetrominoDown() {
	tetromino.row += 1;
	if (isValid()) {
		tetromino.row -= 1;
		placeTetromino();
	}
}

// Rotate figure
export function rotateTetromino() {
	const oldMatrix = tetromino.matrix;
	const rotatedMatrix = rotateMatrix(tetromino.matrix);
	tetromino.matrix = rotatedMatrix;
	if (isValid()) {
		tetromino.matrix = oldMatrix;
	} else {
		calculateDropPosition();
	}
}

// Move left
export function moveTetrominoLeft() {
	tetromino.column -= 1;
	if (isValid()) {
		tetromino.column += 1;
	} else {
		calculateDropPosition();
	}
}

// Move right
export function moveTetrominoRight() {
	tetromino.column += 1;
	if (isValid()) {
		tetromino.column -= 1;
	} else {
		calculateDropPosition();
	}
}

// Check the position and collision
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
	return playfield[tetromino.row + row]?.[tetromino.column + column];
}

// Figure reached the top
function isOutsideOfTopBoard(row) {
	return tetromino.row + row < 0;
}

// Place Tetro in place
function placeTetromino() {
	const matrixSize = tetromino.matrix.length;
	for (let row = 0; row < matrixSize; row++) {
		for (let column = 0; column < matrixSize; column++) {
			if (!tetromino.matrix[row][column]) continue;
			if (isOutsideOfTopBoard(row)) {
				isGameOver = true;
				return;
			}
			playfield[tetromino.row + row][tetromino.column + column] =
				tetromino.name;
		}
	}
	const filledRows = findFilledRows();
	removeFilledRows(filledRows);
	generateTetromino();
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

// Delete filler rows
function removeFilledRows(filledRows) {
	filledRows.forEach(row => {
		dropRowsAbove(row);
	});
	scoreCount(filledRows.length);
}

function dropRowsAbove(rowToDelete) {
	for (let row = rowToDelete; row > 0; row--) {
		playfield[row] = playfield[row - 1];
	}
	// add speed after each deleted column
	speed = Math.floor(speed * 0.97);
	document.getElementById('speed').innerHTML = ++speedDispday;
	// Add new column after delete
	playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}

// Falculate position of the drop for the figure
function calculateDropPosition() {
	const tetrominoRow = tetromino.row;
	tetromino.row++;
	while (!isValid()) {
		tetromino.row++;
	}
	tetromino.dropRow = tetromino.row - 1;
	tetromino.dropColumn = tetromino.column;
	tetromino.row = tetrominoRow;
}

// Count score
export function scoreCount(filledRows) {
	if (filledRows > 0) {
		let points =
			filledRows == 1 ? 10 : filledRows == 2 ? 30 : filledRows == 3 ? 50 : 100;
		setScore(points);
		document.getElementById('score').innerHTML = score;
	}
}

// Game Over
export function gameOver() {
	document.getElementById('game-over-text').innerHTML = 'Game over';
	setHighScore(score);
	stopLoop();
	document.removeEventListener('keydown', onKeyDown);
}
