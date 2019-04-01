export class Cell {
	constructor(config) {
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

		this.onClick = function(){};

		var self = this;
		this.element.addEventListener("click", function(e) { self.clickedOnCell() });
	}

	clickedOnCell() {
		this.onClick(this);
	}
	

	hasPiece() {
		if (this.piece) {
			return true;
		}
		return false;
	}

	getElement() {
		return this.element;
	}

	addPiece(piece) {
		this.piece = piece;
		console.log(piece);
		this.element.append(this.piece.getElement());
	}

	hide() {
		if (this.hasPiece()) {
			this.piece.hide();
		}
	}

	show() {
		if (this.hasPiece()) {
			this.piece.show();
		}
	}

	removePiece() {
		if (this.hasPiece()) {
			this.piece = false;
			this.element.children[0].remove();
		}
	}

	mark(color) {
		this.element.classList.add("marked");
	}

	unmark() {
		this.element.classList.remove("marked");
	}
}