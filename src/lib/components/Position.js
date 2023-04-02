import Component from "./Component";

export class Position extends Component {
	constructor ({ x, y, ...state } = {}) {
		super({
			x,
			y,
			...state,
		});
	}

	pos(asArray = false) {
		if(asArray) {
			return [ this.x, this.y ];
		}

		return {
			...this,
		};
	}

	distance(args = {}) {
		let x,
			y;

		if(Array.isArray(args)) {
			[ x, y ] = args;
		} else {
			({ x, y } = args);
		}

		return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
	}
};

export default Position;