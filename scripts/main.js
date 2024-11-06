class piece {
	constructor(orient, size) {
		this.col = col
		this.row = row
		this.orient = orient;
		this.size = size;
	}
  }

var pieces;
var difficulty;
const Stuff = pieces;

async function clickOnDifficulty(element){
	eraseBoard()

	difficulty = element.srcElement.attributes[1].value
	pieces = await getRandomLayout(difficulty)
	console.log(pieces)
	pieces.red.row = 3;
	pieces.red.orient = "horiz";
	pieces.red.size = 2;

	loadGame()

}


function loadGame(){
	
	const board = document.getElementById("board");
	renderBoard(board, pieces);

	timerInterval = setInterval(function() {
		timer++;
		document.getElementById("timer").innerText = timer;
	}, 1000);

	const solveButton = document.getElementById("button-solve");

	solveButton.addEventListener("click", function() {

		let moves;
		for (let depth=1; depth<25; depth++) {
			moves = checkBoard(pieces, depth);
			if (moves) break;
		}

		if (moves) {
			showMoves(pieces, moves, 0);
		} else {
			alert("Could not solve!");
		}
	});
}

window.onload = () => {
	
	buttonsDifficulty = document.getElementsByClassName('button-difficulty')

	for(var i = 0; i < buttonsDifficulty.length; i++){
		buttonsDifficulty[i].addEventListener("click", (e) => clickOnDifficulty(e) )
	}

}
