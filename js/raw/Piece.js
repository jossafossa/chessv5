export class Piece {
	constructor(config) {
		this.id = config["id"];
		this.artwork = config["artwork"];
		this.logic = config["logic"];
		this.color = config["color"];
		this.round = 0;
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

	calculateOrientation() {

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
					} else {
					}
				}
			}
		}
	}

	show() {
		this.element.style.display = "block";
	}

	hide() {
		this.element.style.display = "none";
	}

	getElement() {
		return this.element;
	}


}