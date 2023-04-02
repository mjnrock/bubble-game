import Component from "./Component";

export class Position extends Component {
	static Factory({ x = 0, y = 0 } = {}, qty = 1) {
		return Component.Factory({ x, y }, qty, Position);
	}

	constructor ({ x = 0, y = 0 } = {}) {
		super({
			x,
			y,
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
};

export default Position;