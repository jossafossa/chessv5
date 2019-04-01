import {Cell} from "./Cell.js";
import {PieceAnimator} from "./PieceAnimator.js";

export class Board {
	constructor(config) {
		this.boardElem = config["element"];
		this.size = config["size"];
		this.colors = config["colors"];
		this.cells = [];

		this.onPieceSelect = function(){};
		this.onCellSelect = function(){};

		this.generateBoard();		
		this.drawBoard();
	}

	generateBoard() {
		for(var y = 0; y < this.size.y; y++) {
			for (var x = 0; x < this.size.x; x++) {
				var color = y % 2 == x % 2 ? this.colors[0] : this.colors[1];
				var cell = new Cell({color: color, size: this.size, pos: [x, y]});
				var self = this;
				cell.onClick = function(cell){ self.clickedOnCell(cell) };
				this.cells.push(cell);
			}
		} 
	}

	clickedOnCell(cell) {
		if (cell.hasPiece()) {			
			this.onPieceSelect(cell);
		} else {
			this.onCellSelect(cell);
		}
	}

	drawBoard() {
		var self = this;
		this.cells.forEach(function(cell) {
			self.boardElem.append(cell.getElement());
		})
	}

	addPiece(cell, piece) {
		this.cells[cell].addPiece(piece);
	}

	getValidMoves(cell) {
		var moves = cell.piece.logic["moves"];
		return this.getValidMovesByLogic(cell, moves);
	}

	getValidFirstMoves(cell) {
		var moves = cell.piece.logic["firstMoves"];		
		return this.getValidMovesByLogic(cell, moves);
	}

	getValidMovesByLogic(cell, moves) {
		var valid = [];
		for (var i in moves) {
			var dir = moves[i];
			for (var j in dir) {
				var move = dir[j];
				var cellPos = this.calcOffset(cell, move.x, move.y);
				var cellIndex = this.posToIndex(cellPos);
				var target = this.cells[cellIndex];
				if (this.IsOnBoard(cellPos) && this.cellIsEmpty(target)) {
					valid.push(target);
					// target.mark("rgba(0,255,0,0.5)");
				} else {
					break;
				}
			}
		}		
		return valid;
	}

	getValidCaptures(cell) {
		var moves = cell.piece.logic["captureMoves"];
		var valid = [];
		for (var i in moves) {
			var dir = moves[i];
			for (var j in dir) {
				var move = dir[j];
				var cellPos = this.calcOffset(cell, move.x, move.y);
				var cellIndex = this.posToIndex(cellPos);
				var target = this.cells[cellIndex];
				if (this.IsOnBoard(cellPos)) {
					if (this.cellIsOpponent(cell, target)) {
						valid.push(target);
						// target.mark("rgba(0,0,255,0.5)");
						break;
					}

					if (!this.cellIsEmpty(target)) {
						break;
					}
				}
				
			}
		}
		return valid;
	}

	markCells(cells) {
		for (var cellIndex in cells) {
			var cell = cells[cellIndex];
			cell.mark("rgba(0,0,255,0.2)");
		}
	}

	unmarkCells() {
		for (var cellIndex in this.cells) {
			var cell = this.cells[cellIndex];
			cell.unmark();
		}
	}

	move(cell, target) {		
		var self = this;
		new PieceAnimator(this.board, cell, target, function() {self.finishMove(cell, target); });

		var piece = cell.piece;
		var cellIndex = this.posToIndex(cell);
		console.log(cellIndex);
		this.cells[cellIndex].removePiece();

		var targetIndex = this.posToIndex(target);
		console.log(targetIndex);
		this.cells[targetIndex].removePiece();
		this.cells[targetIndex].addPiece(piece);
		this.cells[targetIndex].hide();

	}

	finishMove(cell, target) {	
		var targetIndex = this.posToIndex(target);	
		this.cells[targetIndex].show();
	}

	cellIsEmpty(cell) {
		if (!cell.hasPiece()) {
			return true;
		}
		return false;
	}

	cellIsOpponent(cell, target) {
		if (target.hasPiece()) {
			if (target.piece.color != cell.piece.color) {
				return true;
			}
		}
		return false;
	}

	IsOnBoard(pos) {
		if (0 <= pos.x && pos.x < this.size.x && 0 <= pos.y && pos.y < this.size.y ) {
			return true;
		}
		return false;
	}

	calcOffset(cell, x, y) {
		console.log(cell.x, cell.y);
		return {x: cell.x + x, y: cell.y + y};
	}

	posToIndex(pos) {
		return pos.y*this.size.x + pos.x; 
	}
}