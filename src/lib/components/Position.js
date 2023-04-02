import Component from "./Component";

export class Position extends Component {
	constructor ({ x, y, facing, ...state } = {}) {
		super({
			x,
			y,
			facing,
			...state,
		});
	}

	position(asArray = false) {
		if(asArray) {
			return [ this.x, this.y ];
		}

		return {
			x: this.x,
			y: this.y,
		};
	}

	getDistance(args = {}) {
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