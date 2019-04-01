export class Logic {
	constructor(logic) {
		this.parsedRules = {captureMoves: [], moves: [], firstMoves: [], firstCapures: []};
		this.rules = logic.split(";");

		for (var index in this.rules) {
			var rule = this.rules[index];
			var parsedRule = new Rule(rule).get();
			// console.log(rule, parsedRule);
			this.add(parsedRule);
		}
	}

	add(rules) {

		for (var type in rules) {
			this.parsedRules[type].push(rules[type]);
		}
	}

	get() {
		return this.parsedRules;
	}
}

export class Rule {	

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
	constructor(rule) {

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

		while(this.index < this.rule.length) {
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

	get() {
		var moves = this.calcInfinite();
		var all = {
			captureMoves: this.isCapture && !this.isFirst ? moves : [],
			moves: this.isMove && !this.isFirst ? moves : [],
			firstMoves: this.isFirst && this.isMove ? moves : [],
			firstCapures: this.isFirst && this.isCapture ? moves : [],

		};
		return all;
	}

	calcInfinite() {
		var moves = [];

		// check if it has infinities
		if (this.infinite[0] == true || this.infinite[1] == true) {

			// when only one infinity 
			if (this.infinite[0] != true || this.infinite[1] != true) {

				// loop through axis'
				for(var index in this.infinitePower) {
					if (this.infinite[index]) {
						var power = this.infinitePower[index];
						if (power > 0) {
							for(var i = 1; i < power + 1; i++) {
								var move = [this.move[0], this.move[1]];
								// console.log("move:", move);
								move[index] *= i;
								// console.log("adding to move:", move);
								moves.push({x: move[0], y: move[1]});
							}
						}
					}
					
				}
			} 
			// combine two infinities
			else {
				var lowestPower = (this.infinitePower[0] < this.infinitePower[1] && this.infinitePower[0] != 0) ? this.infinitePower[0] : this.infinitePower[1];

				for(var i = 0; i < lowestPower; i++) {
					var move = {x: this.move[0], y: this.move[1]};
					move.x += this.move[0] * i;
					move.y += this.move[1] * i;
					moves.push(move);
				}
			}
			return moves;
		} else {
			return [ 
				{x: this.move[0], y: this.move[1]} 
			];
		}
		
	/*	
		// if both axis are infinite with limit 
		if (this.infinitePower[0] != 0 && this.infinitePower[1] != 0) {

		} else { // if one axis is infinite

		}*/
	}
}