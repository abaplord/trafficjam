const Pieces = {
	red: { col: 2 },
	pc1: { col: 4, row: 5, orient: "horiz", size: 3 },
	pc2: { col: 6, row: 3, orient: "vert", size: 2 },
	pc3: { col: 5, row: 1, orient: "horiz", size: 2 },
	pc4: { col: 1, row: 1, orient: "vert", size: 3 },
	pc5: { col: 5, row: 2, orient: "vert", size: 3 },
	pc6: { col: 4, row: 1, orient: "vert", size: 3 },
	pc7: { col: 3, row: 4, orient: "horiz", size: 2 }


};
const Stuff = Pieces;
Pieces.red.row = 3;
Pieces.red.orient = "horiz";
Pieces.red.size = 2;

window.onload = () => {
	const board = document.getElementById("board");
	renderBoard(board, Pieces);

	timerInterval = setInterval(function() {
		timer++;
		document.getElementById("timer").innerText = timer;
	}, 1000);

	const solveButton = document.getElementById("solve");
	solveButton.addEventListener("click", function() {

		let moves;
		for (let depth=1; depth<25; depth++) {
			moves = checkBoard(Pieces, depth);
			if (moves) break;
		}

		if (moves) {
			showMoves(Pieces, moves, 0);
		} else {
			alert("Could not solve!");
		}
	});
}
