function checkBoard(pieces, depth, lastMovedPieceId) {
	if (isWinner(pieces)) {
		return []; //empty array to store winning moves
	}

	if (depth === 0) {
		return null;
	}

	for (let id in pieces) {
		//don't move the same piece twice in a row
		if (id === lastMovedPieceId) continue;

		const possibleMoves = getPossibleMoves(id, pieces);
		for (let move of possibleMoves) {
			let boardCopy = copyBoard(pieces);
			movePiece(id, boardCopy, move);

			let moves = checkBoard(boardCopy, depth-1, id);
			if (moves !== null) {
				let o = {};
				o[id] = move;
				moves.unshift(o);
				return moves;
			}
		}
	}

	return null;
}
