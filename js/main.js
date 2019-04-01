/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*************************!*\
  !*** ./js/raw/index.js ***!
  \*************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _ChessGame = __webpack_require__(/*! ./ChessGame.js */ 1);
	
	var config = {
		size: [8, 8],
		colors: ["rgb(95, 77, 60)", "#D9D0C0"]
	};
	
	new _ChessGame.ChessGame(".board", config);

/***/ }),
/* 1 */
/*!*****************************!*\
  !*** ./js/raw/ChessGame.js ***!
  \*****************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.ChessGame = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Piece = __webpack_require__(/*! ./Piece.js */ 2);
	
	var _Board = __webpack_require__(/*! ./Board.js */ 3);
	
	var _Player = __webpack_require__(/*! ./Player.js */ 5);
	
	var _Logic = __webpack_require__(/*! ./Logic.js */ 6);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function extend() {
		for (var i = 1; i < arguments.length; i++) {
			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) arguments[0][key] = arguments[i][key];
			}
		}return arguments[0];
	}
	
	var ChessGame = exports.ChessGame = function () {
		function ChessGame(board, config) {
			_classCallCheck(this, ChessGame);
	
			// defaults
			var defaultConfig = {
				size: [8, 8],
				colors: ["white", "black"],
				players: {
					black: {
						layout: [4, 3, 2, 6, 5, 2, 3, 4, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						color: "black",
						orientation: "down"
					},
					white: {
						layout: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 3, 2, 6, 5, 2, 3, 4],
						color: "white",
						orientation: "up"
					}
				},
				pieces: {
					1: {
						name: "pawn",
						artwork: "img/pawn/",
						logic: "fm0,1i2;m0,1;c1,1;c-1,1"
					},
					2: {
						name: "bishop",
						artwork: "img/bishop/",
						logic: "mc1i,1i;mc1i,-1i;mc-1i,-1i;mc-1i,1i"
					},
					3: {
						name: "knight",
						artwork: "img/knight/",
						logic: "mc1,2;mc2,1;mc2,-1;mc1,-2;mc-1,-2;mc-2,-1;mc-2,1;mc-1,2"
					},
	
					4: {
						name: "rook",
						artwork: "img/rook/",
						logic: "mc0,1i;mc1i,0;mc0,-1i;mc-1i,0"
					},
					5: {
						name: "king",
						artwork: "img/king/",
						logic: "mc0,1;mc1,1;mc1,0;mc1,-1;mc0,-1;mc-1,-1;mc-1,0;mc-1,1"
					},
					6: {
						name: "queen",
						artwork: "img/queen/",
						logic: "mc0,1i;mc1i,1i;mc1i,0;mc1i,-1i;mc0,-1i;mc-1i,-1i;mc-1i,0;mc-1i,1i"
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
			};this.config = extend(defaultConfig, config);
	
			// shorthands for config
			this.size = { x: this.config["size"][0], y: this.config["size"][1] };
			this.colors = this.config["colors"];
			this.piecesSetup = this.config["pieces"];
			this.playerSetup = this.config["players"];
	
			// setup variables
			this.boardElem = document.querySelectorAll(board)[0];
			this.board = new _Board.Board({ element: this.boardElem, size: this.size, colors: this.colors });
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
			this.board.onPieceSelect = function (cell) {
				self.selectPiece(cell);
			};
			this.board.onCellSelect = function (cell) {
				self.selectCell(cell);
			};
		}
	
		_createClass(ChessGame, [{
			key: "selectPiece",
			value: function selectPiece(cell) {
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
		}, {
			key: "selectCell",
			value: function selectCell(cell) {
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
	
		}, {
			key: "generatePlayers",
			value: function generatePlayers() {
				for (var name in this.playerSetup) {
					var player = this.playerSetup[name];
					this.players.push(new _Player.Player({
						name: name,
						color: player["color"],
						orientation: player["orientation"],
						layout: player["layout"]
					}));
				}
				this.activePlayer = this.players[this.activePlayerIndex];
			}
		}, {
			key: "switchPlayer",
			value: function switchPlayer() {
				this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
				this.activePlayer = this.players[this.activePlayerIndex];
				console.log(this.activePlayerIndex);
			}
		}, {
			key: "populateBoard",
			value: function populateBoard() {
				for (var i in this.players) {
					var player = this.players[i];
					var layout = this.players[i].layout;
					for (var cell in layout) {
						var pieceID = layout[cell];
						if (pieceID != 0) {
							var piece = this.piecesSetup[pieceID];
							var logic = new _Logic.Logic(piece["logic"]).get();
							this.board.addPiece(cell, new _Piece.Piece({
								name: piece["name"],
								id: pieceID,
								artwork: piece["artwork"],
								logic: logic,
								color: player["color"],
								orientation: player["orientation"]
							}));
						}
					}
				}
			}
		}]);

		return ChessGame;
	}();

/***/ }),
/* 2 */
/*!*************************!*\
  !*** ./js/raw/Piece.js ***!
  \*************************/
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Piece = exports.Piece = function () {
		function Piece(config) {
			_classCallCheck(this, Piece);
	
			this.id = config["id"];
			this.artwork = config["artwork"];
			this.logic = config["logic"];
			this.color = config["color"];
			this.orientation = config["orientation"];
	
			this.element = document.createElement("div");
			this.element.classList.add("piece");
			this.element.style.backgroundImage = "url('" + this.artwork + this.color + ".svg')";
	
			this.calculateOrientation();
		}
	
		// up
		// [1,1] -> [-1,-1] = x*-1 & y*-1
		// 
		// right
		// (x,y) => (y,-x)
		// 
		// left
		// (x,y) => (-y,x)
		// [1,1] -> [-1, 1] = x*-1 & y*1
		// [-1,0] -> [0, -1] = x*-1 & y*1
	
		_createClass(Piece, [{
			key: "calculateOrientation",
			value: function calculateOrientation() {
	
				for (var ruleType in this.logic) {
					var rules = this.logic[ruleType];
					for (var i in rules) {
						var dir = rules[i];
						for (var j in dir) {
							var move = dir[j];
							if (this.orientation == "up") {
								this.logic[ruleType][i][j].x *= -1;
								this.logic[ruleType][i][j].y *= -1;
							} else if (this.orientation == "right") {
								this.logic[ruleType][i][j].x = rule.y;
								this.logic[ruleType][i][j].y = rule.x * -1;
							} else if (this.orientation == "left") {
								this.logic[ruleType][i][j].x = rule.y * -1;
								this.logic[ruleType][i][j].y = rule.x;
							} else {}
						}
					}
				}
			}
		}, {
			key: "show",
			value: function show() {
				this.element.style.display = "block";
			}
		}, {
			key: "hide",
			value: function hide() {
				this.element.style.display = "none";
			}
		}, {
			key: "getElement",
			value: function getElement() {
				return this.element;
			}
		}]);

		return Piece;
	}();

/***/ }),
/* 3 */
/*!*************************!*\
  !*** ./js/raw/Board.js ***!
  \*************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Board = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Cell = __webpack_require__(/*! ./Cell.js */ 4);
	
	var _PieceAnimator = __webpack_require__(/*! ./PieceAnimator.js */ 7);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Board = exports.Board = function () {
		function Board(config) {
			_classCallCheck(this, Board);
	
			this.boardElem = config["element"];
			this.size = config["size"];
			this.colors = config["colors"];
			this.cells = [];
	
			this.onPieceSelect = function () {};
			this.onCellSelect = function () {};
	
			this.generateBoard();
			this.drawBoard();
		}
	
		_createClass(Board, [{
			key: "generateBoard",
			value: function generateBoard() {
				for (var y = 0; y < this.size.y; y++) {
					for (var x = 0; x < this.size.x; x++) {
						var color = y % 2 == x % 2 ? this.colors[0] : this.colors[1];
						var cell = new _Cell.Cell({ color: color, size: this.size, pos: [x, y] });
						var self = this;
						cell.onClick = function (cell) {
							self.clickedOnCell(cell);
						};
						this.cells.push(cell);
					}
				}
			}
		}, {
			key: "clickedOnCell",
			value: function clickedOnCell(cell) {
				if (cell.hasPiece()) {
					this.onPieceSelect(cell);
				} else {
					this.onCellSelect(cell);
				}
			}
		}, {
			key: "drawBoard",
			value: function drawBoard() {
				var self = this;
				this.cells.forEach(function (cell) {
					self.boardElem.append(cell.getElement());
				});
			}
		}, {
			key: "addPiece",
			value: function addPiece(cell, piece) {
				this.cells[cell].addPiece(piece);
			}
		}, {
			key: "getValidMoves",
			value: function getValidMoves(cell) {
				var moves = cell.piece.logic["moves"];
				return this.getValidMovesByLogic(cell, moves);
			}
		}, {
			key: "getValidFirstMoves",
			value: function getValidFirstMoves(cell) {
				var moves = cell.piece.logic["firstMoves"];
				return this.getValidMovesByLogic(cell, moves);
			}
		}, {
			key: "getValidMovesByLogic",
			value: function getValidMovesByLogic(cell, moves) {
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
		}, {
			key: "getValidCaptures",
			value: function getValidCaptures(cell) {
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
		}, {
			key: "markCells",
			value: function markCells(cells) {
				for (var cellIndex in cells) {
					var cell = cells[cellIndex];
					cell.mark("rgba(0,0,255,0.2)");
				}
			}
		}, {
			key: "unmarkCells",
			value: function unmarkCells() {
				for (var cellIndex in this.cells) {
					var cell = this.cells[cellIndex];
					cell.unmark();
				}
			}
		}, {
			key: "move",
			value: function move(cell, target) {
				var self = this;
				new _PieceAnimator.PieceAnimator(this.board, cell, target, function () {
					self.finishMove(cell, target);
				});
	
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
		}, {
			key: "finishMove",
			value: function finishMove(cell, target) {
				var targetIndex = this.posToIndex(target);
				this.cells[targetIndex].show();
			}
		}, {
			key: "cellIsEmpty",
			value: function cellIsEmpty(cell) {
				if (!cell.hasPiece()) {
					return true;
				}
				return false;
			}
		}, {
			key: "cellIsOpponent",
			value: function cellIsOpponent(cell, target) {
				if (target.hasPiece()) {
					if (target.piece.color != cell.piece.color) {
						return true;
					}
				}
				return false;
			}
		}, {
			key: "IsOnBoard",
			value: function IsOnBoard(pos) {
				if (0 <= pos.x && pos.x < this.size.x && 0 <= pos.y && pos.y < this.size.y) {
					return true;
				}
				return false;
			}
		}, {
			key: "calcOffset",
			value: function calcOffset(cell, x, y) {
				console.log(cell.x, cell.y);
				return { x: cell.x + x, y: cell.y + y };
			}
		}, {
			key: "posToIndex",
			value: function posToIndex(pos) {
				return pos.y * this.size.x + pos.x;
			}
		}]);

		return Board;
	}();

/***/ }),
/* 4 */
/*!************************!*\
  !*** ./js/raw/Cell.js ***!
  \************************/
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Cell = exports.Cell = function () {
		function Cell(config) {
			_classCallCheck(this, Cell);
	
			this.color = config["color"];
			this.size = config["size"];
			this.x = config["pos"][0];
			this.y = config["pos"][1];
			this.piece = false;
			this.element = document.createElement("div");
			this.element.classList.add("cell");
			this.element.style.backgroundColor = this.color;
			this.element.style.width = 100 / this.size.x + "%";
			this.element.style.height = 100 / this.size.y + "%";
	
			this.onClick = function () {};
	
			var self = this;
			this.element.addEventListener("click", function (e) {
				self.clickedOnCell();
			});
		}
	
		_createClass(Cell, [{
			key: "clickedOnCell",
			value: function clickedOnCell() {
				this.onClick(this);
			}
		}, {
			key: "hasPiece",
			value: function hasPiece() {
				if (this.piece) {
					return true;
				}
				return false;
			}
		}, {
			key: "getElement",
			value: function getElement() {
				return this.element;
			}
		}, {
			key: "addPiece",
			value: function addPiece(piece) {
				this.piece = piece;
				console.log(piece);
				this.element.append(this.piece.getElement());
			}
		}, {
			key: "hide",
			value: function hide() {
				if (this.hasPiece()) {
					this.piece.hide();
				}
			}
		}, {
			key: "show",
			value: function show() {
				if (this.hasPiece()) {
					this.piece.show();
				}
			}
		}, {
			key: "removePiece",
			value: function removePiece() {
				if (this.hasPiece()) {
					this.piece = false;
					this.element.children[0].remove();
				}
			}
		}, {
			key: "mark",
			value: function mark(color) {
				this.element.classList.add("marked");
			}
		}, {
			key: "unmark",
			value: function unmark() {
				this.element.classList.remove("marked");
			}
		}]);

		return Cell;
	}();

/***/ }),
/* 5 */
/*!**************************!*\
  !*** ./js/raw/Player.js ***!
  \**************************/
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Player = exports.Player = function Player(config) {
		_classCallCheck(this, Player);
	
		this.name = config["name"];
		this.color = config["color"];
		this.orientation = config["orientation"];
		this.layout = config["layout"];
	};

/***/ }),
/* 6 */
/*!*************************!*\
  !*** ./js/raw/Logic.js ***!
  \*************************/
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Logic = exports.Logic = function () {
		function Logic(logic) {
			_classCallCheck(this, Logic);
	
			this.parsedRules = { captureMoves: [], moves: [], firstMoves: [], firstCapures: [] };
			this.rules = logic.split(";");
	
			for (var index in this.rules) {
				var rule = this.rules[index];
				var parsedRule = new Rule(rule).get();
				// console.log(rule, parsedRule);
				this.add(parsedRule);
			}
		}
	
		_createClass(Logic, [{
			key: "add",
			value: function add(rules) {
	
				for (var type in rules) {
					this.parsedRules[type].push(rules[type]);
				}
			}
		}, {
			key: "get",
			value: function get() {
				return this.parsedRules;
			}
		}]);
	
		return Logic;
	}();
	
	var Rule = exports.Rule = function () {
	
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
		// 
		function Rule(rule) {
			_classCallCheck(this, Rule);
	
			this.rule = rule;
	
			this.isMove = false;
			this.isCapture = false;
			this.isFirst = false;
	
			this.move = [0, 0];
			this.infinite = [false, false];
			this.infinitePower = [8, 8];
	
			this.coordIndex = 0;
			this.nrIndex = 0;
			this.negative = false;
			this.index = 0;
	
			while (this.index < this.rule.length) {
				var char = this.rule.charAt(this.index);
	
				if (char == "m") {
					this.isMove = true;
				}
				if (char == "c") {
					this.isCapture = true;
				}
				if (char == "f") {
					this.isFirst = true;
				}
				if (char == "-") {
					this.negative = true;
				}
				if (isNaN(parseInt(char)) == false) {
					if (this.infinite[this.coordIndex]) {
						this.infinitePower[this.coordIndex] = parseInt(char);
					} else {
						this.move[this.coordIndex] *= Math.pow(10, this.nrIndex);
						this.move[this.coordIndex] += parseInt(char) * (this.negative ? -1 : 1);
						this.nrIndex++;
					}
				}
				if (char == "i") {
					this.infinite[this.coordIndex] = true;
				}
				if (char == ",") {
					this.coordIndex++;
					this.negative = false;
					this.infinite[this.coordIndex] = false;
					this.nrIndex = 0;
				}
				this.index++;
			}
		}
	
		_createClass(Rule, [{
			key: "get",
			value: function get() {
				var moves = this.calcInfinite();
				var all = {
					captureMoves: this.isCapture && !this.isFirst ? moves : [],
					moves: this.isMove && !this.isFirst ? moves : [],
					firstMoves: this.isFirst && this.isMove ? moves : [],
					firstCapures: this.isFirst && this.isCapture ? moves : []
	
				};
				return all;
			}
		}, {
			key: "calcInfinite",
			value: function calcInfinite() {
				var moves = [];
	
				// check if it has infinities
				if (this.infinite[0] == true || this.infinite[1] == true) {
	
					// when only one infinity 
					if (this.infinite[0] != true || this.infinite[1] != true) {
	
						// loop through axis'
						for (var index in this.infinitePower) {
							if (this.infinite[index]) {
								var power = this.infinitePower[index];
								if (power > 0) {
									for (var i = 1; i < power + 1; i++) {
										var move = [this.move[0], this.move[1]];
										// console.log("move:", move);
										move[index] *= i;
										// console.log("adding to move:", move);
										moves.push({ x: move[0], y: move[1] });
									}
								}
							}
						}
					}
					// combine two infinities
					else {
							var lowestPower = this.infinitePower[0] < this.infinitePower[1] && this.infinitePower[0] != 0 ? this.infinitePower[0] : this.infinitePower[1];
	
							for (var i = 0; i < lowestPower; i++) {
								var move = { x: this.move[0], y: this.move[1] };
								move.x += this.move[0] * i;
								move.y += this.move[1] * i;
								moves.push(move);
							}
						}
					return moves;
				} else {
					return [{ x: this.move[0], y: this.move[1] }];
				}
	
				/*	
	   	// if both axis are infinite with limit 
	   	if (this.infinitePower[0] != 0 && this.infinitePower[1] != 0) {
	   
	   	} else { // if one axis is infinite
	   
	   	}*/
			}
		}]);

		return Rule;
	}();

/***/ }),
/* 7 */
/*!*********************************!*\
  !*** ./js/raw/PieceAnimator.js ***!
  \*********************************/
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PieceAnimator = exports.PieceAnimator = function () {
		function PieceAnimator(board, from, to, callback) {
			_classCallCheck(this, PieceAnimator);
	
			this.callback = callback;
			this.board = board;
			this.element = document.createElement("div");
			this.element.classList.add("piece-animator");
			this.animate(from, to);
		}
	
		_createClass(PieceAnimator, [{
			key: "animate",
			value: function animate(from, to) {
				var piece = from.piece;
				var fromTop = from.element.getBoundingClientRect().top + document.documentElement.scrollTop;
				var fromLeft = from.element.getBoundingClientRect().left + document.documentElement.scrollLeft;
				var toTop = to.element.getBoundingClientRect().top + document.documentElement.scrollTop;
				var toLeft = to.element.getBoundingClientRect().left + document.documentElement.scrollLeft;
				var background = piece.element.style.backgroundImage;
				this.element.style.width = from.element.getBoundingClientRect().width + "px";
				this.element.style.height = from.element.getBoundingClientRect().height + "px";
				this.element.style.transform = "translate3D(" + fromLeft + "px, " + fromTop + "px, 0)";
				this.element.style.backgroundImage = background;
				document.body.append(this.element);
	
				var self = this;
				setTimeout(function () {
					self.to(toLeft, toTop);
				}, 100);
			}
		}, {
			key: "to",
			value: function to(x, y) {
				this.element.style.transform = "translate3D(" + x + "px, " + y + "px, 0)";
				var self = this;
				setTimeout(function () {
					self.triggerCallback();
				}, 500);
			}
		}, {
			key: "triggerCallback",
			value: function triggerCallback() {
				document.body.removeChild(this.element);
				this.callback();
			}
		}]);

		return PieceAnimator;
	}();

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map