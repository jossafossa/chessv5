import {MoveRule} from "./Logic2.js";

var config = {
	size: [8,8],
	colors: ["red", "blue"]
};

new ChessGame(".board", config);

new MoveRule("henk");