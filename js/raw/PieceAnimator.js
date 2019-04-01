export class PieceAnimator {
	constructor(board, from, to, callback) {
		this.callback = callback;
		this.board = board;
		this.element = document.createElement("div");
		this.element.classList.add("piece-animator");
		this.animate(from, to);
	}

	animate(from, to) {
		var piece = from.piece;
		var fromTop = from.element.getBoundingClientRect().top + document.documentElement.scrollTop;
		var fromLeft = from.element.getBoundingClientRect().left + document.documentElement.scrollLeft;
		var toTop = to.element.getBoundingClientRect().top + document.documentElement.scrollTop;
		var toLeft = to.element.getBoundingClientRect().left + document.documentElement.scrollLeft;
		var background = piece.element.style.backgroundImage;
		this.element.style.width = from.element.getBoundingClientRect().width + "px";
		this.element.style.height = from.element.getBoundingClientRect().height + "px";
		this.element.style.transform = `translate3D(${fromLeft}px, ${fromTop}px, 0)`;
		this.element.style.backgroundImage = background;
		document.body.append(this.element);

		var self = this;
		setTimeout(function()	{ self.to(toLeft, toTop) }, 100);
	}

	to(x, y) {
		this.element.style.transform = `translate3D(${x}px, ${y}px, 0)`;
		var self = this;
		setTimeout(function()	{ self.triggerCallback() }, 500);
	}

	triggerCallback() {
		document.body.removeChild(this.element);
		this.callback();
	}
}