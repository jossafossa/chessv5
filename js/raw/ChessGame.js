import {Piece} from "./Piece.js";
import {Board} from "./Board.js";
import {Player} from "./Player.js";
import {Logic} from "./Logic.js";

function extend(){
  for(var i=1; i<arguments.length; i++)
    for(var key in arguments[i])
      if(arguments[i].hasOwnProperty(key))
        arguments[0][key] = arguments[i][key];
  return arguments[0]; 
}

export class ChessGame {
	constructor(board, config) {
		// defaults
		var defaultConfig = {
			size: [8,8],
			colors: ["white", "black"],
			players: {
				black: {
					layout: [
						4,3,2,6,5,2,3,4,
						1,1,1,1,1,1,1,1,
						0,0,0,0,0,0,0,0,
						0,0,0,0,0,0,0,0,
						0,0,0,0,0,0,0,0,
						0,0,0,0,0,0,0,0,
						0,0,0,0,0,0,0,0,
						0,0,0,0,0,0,0,0,
					],
					color: "black",
					orientation: "down",
				},	
				white: {
					layout: [
						0,0,0,0,0,0,0,0,
						0,0,0,0,0,0,0,0,
						0,0,0,0,0,0,0,0,
						0,0,0,0,0,0,0,0,
						0,0,0,0,0,0,0,0,
						0,0,0,0,0,0,0,0,
						1,1,1,1,1,1,1,1,
						4,3,2,6,5,2,3,4,
					],
					color: "white",
					orientation: "up",
				},			
			},
			pieces: {
				1: {
					name: "pawn",
					artwork: "img/pawn/",
					logic: "fm0,1i2;m0,1;c1,1;c-1,1",
				},
				2: {
					name: "bishop",
					artwork: "img/bishop/",
					logic: "mc1i,1i;mc1i,-1i;mc-1i,-1i;mc-1i,1i",
				},
				3: {
					name: "knight",
					artwork: "img/knight/",
					logic: "mc1,2;mc2,1;mc2,-1;mc1,-2;mc-1,-2;mc-2,-1;mc-2,1;mc-1,2",
				},
				
				4: {
					name: "rook",
					artwork: "img/rook/",
					logic: "mc0,1i;mc1i,0;mc0,-1i;mc-1i,0",
				},
				5: {
					name: "king",
					artwork: "img/king/",
					logic: "mc0,1;mc1,1;mc1,0;mc1,-1;mc0,-1;mc-1,-1;mc-1,0;mc-1,1",
				},
				6: {
					name: "queen",
					artwork: "img/queen/",
					logic: "mc0,1i;mc1i,1i;mc1i,0;mc1i,-1i;mc0,-1i;mc-1i,-1i;mc-1i,0;mc-1i,1i",
				},

			}
		}

		// LOGIC
		// * all coordinates are relative to the playing direction. 
		// * 1 = towards opponent, -1 away from opponent
		// 
		// normal rule:
		// [m][c][f]<x>[i][<nr_of_steps>],<y>[i][<nr_of_steps>];
		// example: mc0,1i2;
		// 
		// transfrom rule:
		// t[r<row_id>|c<column_id>],<piece_id>;
		// example: tr1,2;
		// 
		// win condition:
		// w[??]

		// extend defaults
		this.config = extend(defaultConfig, config);

		// shorthands for config
		this.size = {x: this.config["size"][0], y: this.config["size"][1]};
		this.colors = this.config["colors"];
		this.piecesSetup = this.config["pieces"];
		this.playerSetup = this.config["players"];

		// setup variables
		this.boardElem = document.querySelectorAll(board)[0];
		this.board = new Board({element: this.boardElem, size: this.size, colors: this.colors});
		this.pieces = {};
		this.players = [];
		this.activePlayer;
		this.activePlayerIndex = 0;
		this.selectedCell = false;
		this.validMoves = [];
		this.validCaptures = [];
		this.validFirstMoves = [];

		// setup sequence
		// this.generatePieces();
		this.generatePlayers();
		this.populateBoard();

		var self = this;
		this.board.onPieceSelect = function(cell) {self.selectPiece(cell)};		
		this.board.onCellSelect = function(cell) {self.selectCell(cell)};
	}

	selectPiece(cell) {
		console.log("click piece");
		if (!this.selectedCell) {
			if (this.activePlayer.color == cell.piece.color) {
				console.log("own player");
				this.selectedCell = cell;
				this.validFirstMoves = this.board.getValidFirstMoves(cell);
				this.validMoves = this.board.getValidMoves(cell);
				this.validCaptures = this.board.getValidCaptures(cell);

				this.board.markCells(this.validMoves);
				this.board.markCells(this.validCaptures);
			}
		} else {
			if (this.validCaptures.includes(cell)) {
				console.log("capture");
				this.board.move(this.selectedCell, cell);
				this.selectedCell = false;
				this.board.unmarkCells();
				this.switchPlayer();
			} else {					
				this.selectedCell = false;
				this.board.unmarkCells();
			}
		}
	}

	selectCell(cell) {
		console.log("click cell");
		if (this.selectedCell && this.validMoves.includes(cell)) {
			this.board.move(this.selectedCell, cell);
			this.selectedCell = false;
			this.switchPlayer();
			this.board.unmarkCells();
		} else {
			this.selectedCell = false;
			this.board.unmarkCells();
		}
	}

	// generatePieces() {
	// 	for(var name in this.piecesSetup) {
	// 		var piece = this.piecesSetup[name];
	// 		var logic = new Logic(piece["logic"]).get();
	// 		console.log(logic);
	// 		this.pieces[piece["id"]] = new Piece({
	// 			name: name, 
	// 			id: piece["id"], 
	// 			artwork: piece["artwork"], 
	// 			logic: logic,
	// 		});
	// 	}
	// }

	generatePlayers() {
		for(var name in this.playerSetup) {
			var player = this.playerSetup[name];
			this.players.push( new Player({
				name: name,
				color: player["color"],
				orientation: player["orientation"],
				layout: player["layout"],
			}) );
		}
		this.activePlayer = this.players[this.activePlayerIndex];
	}

	switchPlayer() {
		this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
		this.activePlayer = this.players[this.activePlayerIndex];
		console.log(this.activePlayerIndex);
	}

	populateBoard() {
		for (var i in this.players) {
			var player = this.players[i];
			var layout = this.players[i].layout;
			for (var cell in layout) {
				var pieceID = layout[cell];
				if (pieceID != 0) {		
					var piece = this.piecesSetup[pieceID];
					var logic = new Logic(piece["logic"]).get();
					this.board.addPiece( cell, new Piece({
						name: piece["name"], 
						id: pieceID, 
						artwork: piece["artwork"], 
						logic: logic,
						color: player["color"],
						orientation: player["orientation"],
					}) )
				}
			}
		}
	}
}