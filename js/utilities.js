// Width and height
export const PLAYFIELD_COLUMNS = 10;
export const PLAYFIELD_ROWS = 20;

// Figures names
export const TETROMINO_NAMES = ['O', 'L', 'J', 'I', 'S', 'Z', 'T'];

// Figures
export const TETROMINOES = {
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

export function getRandomFigure(array) {
	let randonIndex = Math.floor(Math.random() * TETROMINO_NAMES.length);
	return array[randonIndex];
	
}

// Find position of figure
export function convertPositionToIndex(row, column) {
	return row * PLAYFIELD_COLUMNS + column;
}

// TODO rotate I,S and Z other way
export function rotateMatrix(matrix) {
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
