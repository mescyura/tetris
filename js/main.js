import {
	PLAYFIELD_COLUMNS,
	PLAYFIELD_ROWS,
	TETROMINO_NAMES,
	TETROMINOES,
	convertPositionToIndex,
} from './utilities.js';

import {
	playfield,
	tetromino,
	score,
	isGameOver,
	setGameOver,
	setScore,
	generatePlayField,
	generateTetromino,
	moveTetrominoDown,
	dropTetrominoDown,
	moveTetrominoLeft,
	moveTetrominoRight,
	rotateTetromino,
	scoreCount,
	gameOver,
} from './tetris.js';

let cells;

let isPause = false;

// Loop
let timeOutId;
let requestId;

const btnRestart = document.querySelector('.restart');
const gameOverBlock = document.querySelector('.game-over');


btnRestart.addEventListener('click', function () {
	init();
});

init();
moveDown();

// Start the game
function init() {
	initKeydown();
	gameOverBlock.style.display = 'none';
	setGameOver(false);
	generatePlayField();
	generateTetromino();
	startLoop();
	cells = document.querySelectorAll('.tetris div');
	setScore(0);
	scoreCount(null);
}

// Draw the playfield after every move
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

// Draw the figure every move
function drawTetromino() {
	const name = tetromino.name;
	const tetrominoMatrixSize = tetromino.matrix.length;

	for (let row = 0; row < tetrominoMatrixSize; row++) {
		for (let column = 0; column < tetrominoMatrixSize; column++) {
			if (tetromino.matrix[row][column] == 0) {
				continue;
			}
			if (tetromino.row + row < 0) {
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

// Draw the new position for the figure
function draw() {
	cells.forEach(function (cell) {
		cell.removeAttribute('class');
	});
	drawPlayfield();
	drawTetromino();
}

function initKeydown() {
	document.addEventListener('keydown', onKeyDown);
}

// controls
export function onKeyDown(event) {
	if (event.key == 'p') {
		togglePauseGame();
	}
	if (isPause) {
		return;
	}
	switch (event.key) {
		case ' ':
			dropDown();
			break;
		case 'ArrowDown':
			moveDown();
			break;
		case 'ArrowUp':
			rotate();
			break;
		case 'ArrowLeft':
			moveLeft();
			break;
		case 'ArrowRight':
			moveRight();
			break;
		default:
			return;
	}
}

function dropDown() {
	dropTetrominoDown();
	draw();
	stopLoop();
	startLoop();

	if (isGameOver) {
		gameOver();
	}
}

function moveDown() {
	moveTetrominoDown();
	draw();
	stopLoop();
	startLoop();

	if (isGameOver) {
		gameOver();
	}
}

function moveLeft() {
	moveTetrominoLeft();
	draw();
}

function moveRight() {
	moveTetrominoRight();
	draw();
}

function rotate() {
	rotateTetromino();
	draw();
}

// Start stop drop down
function startLoop() {
	timeOutId = setTimeout(
		() => (requestId = requestAnimationFrame(moveDown)),
		700
	);
}

export function stopLoop() {
	cancelAnimationFrame(requestId);
	clearTimeout(timeOutId);
}

// Pause p key
function togglePauseGame() {
	isPause = !isPause;

	if (isPause) {
		stopLoop();
	} else {
		startLoop();
	}
}