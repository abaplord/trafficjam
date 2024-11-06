async function getData(file){
		var data = fetch(file).then(response => response.json())
	
		
		return data
	}

function getRandomNumber(min, max){
	return Math.random() * (max - min) + min
}

async function getRandomLayout(difficulty){
	var jsonResponse = await getData("./scripts/layouts.json")
	var response = Object.entries(jsonResponse)
	var layouts;

	switch(difficulty){
		case "easy":
			layouts = response[0][1]
			break
		case "medium":
			layouts = response[1][1]
			break
		case "hard":
			layouts = response[2][1]
			break
	}
	return layouts[getRandomNumber(1, Object.entries(layouts).length)]
}
function getAvailableSpaces(pieces) {

	let grid = {};

	for (let i = 1; i <= 6; i++) {
		for (let j = 1; j <= 6; j++) {
			grid[`${i},${j}`] = true;
		}
	}

	for (let id in pieces) {
		let piece = pieces[id];

		for (let i = 0; i<piece.size; i++) {
			if (piece.orient === "horiz") {
				grid[`${piece.col+i},${piece.row}`] = false;
			} else if (piece.orient === "vert") {
				grid[`${piece.col},${piece.row+i}`] = false;
			}
		}
	}

	return grid;
}

function getPossibleMoves(pieceId, pieces) {
	let moves = [];
	const piece = pieces[pieceId];

	const availableSpaces = getAvailableSpaces(pieces);

	if (piece.orient === "horiz") {
		for (let i = piece.col-1; i >= 1; i--) {
			const pos = `${i},${piece.row}`;
			if (availableSpaces[pos]) {
				moves.push(pos);
			} else { 
				break;
			}
		}

		for (let i = piece.col+piece.size; i <= 6; i++) {
			if (availableSpaces[`${i},${piece.row}`]) {
				moves.push(`${i-piece.size+1},${piece.row}`);
			} else {
				break;
			}
		}
	} else if (piece.orient === "vert") {
		for (let i = piece.row-1; i >= 1; i--) {
			const pos = `${piece.col},${i}`;
			if (availableSpaces[pos]) {
				moves.push(pos);
			} else {
				break;
			}
		}

		for (let i = piece.row+piece.size; i <= 6; i++) {
			if (availableSpaces[`${piece.col},${i}`]) {
				moves.push(`${piece.col},${i-piece.size+1}`);
			} else {
				break;
			}
		}
	}

	return moves;
}

function movePiece(pieceId, pieces, newposition) {
	const position = newposition.split(",").map(x  => parseInt(x));
	pieces[pieceId].col = position[0];
	pieces[pieceId].row = position[1];
}

function canLeave(pieces) {
	const moves = getPossibleMoves("red", pieces);
	return moves.indexOf("5,3")  >=  0;
}

function isWinner(pieces) {
	return (pieces.red.col === 5 && pieces.red.row === 3);
}

function copyBoard(pieces) {
	let boardCopy = {};

	for (let id in pieces) {
		boardCopy[id] = {...pieces[id]};
	}

	return boardCopy;
}
