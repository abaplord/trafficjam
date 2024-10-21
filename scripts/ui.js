let numMoves = 0;
let timer = 0;
let timerInterval;

function renderBoard(boardElement, pieces) {
	for (let pieceId in pieces) {
		let piece = pieces[pieceId];

		const newPiece = document.createElement("div");

		newPiece.id = pieceId;

		if (piece.size === 2) {
			newPiece.classList.add("car");
		} else if (piece.size === 3) {
			newPiece.classList.add("truck");
		}

		//TODO: error checking here
		if (piece.orient) {
			newPiece.classList.add(piece.orient);
		}
		
		newPiece.addEventListener("click", ev => {
			selectPiece(ev.target.id, pieces);
		});

		boardElement.appendChild(newPiece);
	}

	//move pieces to where they need to go
	updateBoard(pieces);
	
	initAvailableMoveElements(boardElement);
}

function updateBoard(pieces) {
	for (let pieceId in pieces) {
		const piece = pieces[pieceId];
		const pieceElement = document.getElementById(pieceId);

		if (piece.col) {
			pieceElement.style.left = `${piece.col-1}em`;
		}

		if (piece.row) {
			pieceElement.style.top = `${piece.row-1}em`;
		}
	}
}

//create elements to visualize possible moves
function initAvailableMoveElements(boardElement) {
	for (let i=1; i<=6; i++) {
		for (let j=1; j<=6; j++) {
			const e = document.createElement("div");
			e.id = `available-${i}-${j}`;
			e.className = "available";
			//only show these elements when a piece is selected,
			//and the space represented by the element in question is
			//one of the possible moves for that piece. 
			e.style.display = "none";

			boardElement.appendChild(e);
		}
	}
}

function deselectAll() {
	//remove selected class from all elements
	const selected = document.getElementsByClassName("selected");
	for (item of selected) {
		item.classList.remove("selected");
	}

	//hide available moves squares
	const available = document.getElementsByClassName("available");
	for (item of available) {
		item.style.display = "none";
	}
}

function selectPiece(pieceId, pieces) {
	const pieceElement = document.getElementById(pieceId);
	const isSelected = pieceElement.classList.contains("selected");

	deselectAll();

	//if already selected, then deselect and go
	if (isSelected) return;

	pieceElement.classList.add("selected");

	const piece = pieces[pieceId];

	const possibleMoves = getPossibleMoves(pieceId, pieces);
	for (let move of possibleMoves) {
		const availableElement = getAvailableElementForMove(move, piece);
		availableElement.style.display = "block";

		//event handler needs to be a singleton,
		//so use onclick instead of addEventListener
		availableElement.onclick = () =>
			clickAvailable(pieceId, pieces, move);
	}
}

function clickAvailable(pieceId, pieces, move) {
	deselectAll();

	movePiece(pieceId, pieces, move);
	numMoves++;
	document.getElementById("numMoves").innerText = numMoves;

	//const score = Math.floor(1000000 / (timer * numMoves));
	//document.getElementById("score").innerText = score;

	updateBoard(pieces);

	//did we win with this move?
	if (isWinner(pieces)) showWinner();
}

function showWinner() {
	const redElement = document.getElementById("red");
	const boardElement = redElement.parentElement;
	redElement.classList.add("free");
	boardElement.classList.add("winner");

	clearInterval(timerInterval);
}

//pieces move based on their top-left position, but that doesn't look
//good in the UI: instead, we want availablity hints to show up on
//either side of the piece
function getAvailableElementForMove(move, piece) {
	//adjust position of possible move (which is
	//relative to top-left of piece) for UI (so squares look good)
	const pos = move.split(",").map(x => parseInt(x));

	if (pos[0] > piece.col) {
		pos[0] += piece.size;
		pos[0]--;
	} else if (pos[1] > piece.row) {
		pos[1] += piece.size;
		pos[1]--;
	}

	//map to element ID
	const availableId = "available-" + pos.join("-");
	return document.getElementById(availableId);
}

//i should start at 0 (beginning of array) on first call
function showMoves(pieces, moves, i) {
	if (moves[i] === undefined) return; //nothing to show (already won?)

	const pieceId = Object.keys(moves[i])[0];
	const move = moves[i][pieceId];
	movePiece(pieceId, pieces, move);
	numMoves++;
	document.getElementById("numMoves").innerText = numMoves;
	updateBoard(pieces);

	if (i >= moves.length-1) {
		showWinner();
		return;
	}

	//show next move after interval
	setTimeout(function() {
		showMoves(pieces, moves, i+1);
	}, 500);
}
