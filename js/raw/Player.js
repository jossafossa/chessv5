export class Player {
	constructor(config) {
		this.name = config["name"];
		this.color = config["color"];
		this.orientation = config["orientation"];
		this.layout = config["layout"];
	}
}