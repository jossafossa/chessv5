

export class Scoreboard {
	constructor(element) {
		this.element = element;

		this.playerElem = document.createElement("h1");
		this.element.appendChild(this.playerElem);
	}

	setPlayer(player) {
		this.playerElem.innerHTML = `Turn: ${player}`;
		console.log("henkiepi");
	} 


}