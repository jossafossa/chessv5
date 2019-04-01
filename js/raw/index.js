import {ChessGame} from "./ChessGame.js";


var config = {
	size: [8,8],
	colors: ["rgb(95, 77, 60)", "#D9D0C0"]
};

new ChessGame(".board", config);