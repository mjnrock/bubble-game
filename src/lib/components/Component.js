import { deepCopy } from "../util/helper";

export class Component {
	static Factory({ ...state } = {}, qty = 1) {
		let components = [];
		for(let i = 0; i < qty; i++) {
			components.push(new this({ ...state }));
		}

		if(qty === 1) {
			return components[ 0 ];
		}

		return components;
	}

	constructor ({ ...state } = {}) {
		for(let key in state) {
			this[ key ] = state[ key ];
		}
	}

	// Iterate over all kvps that don't begin with _
	*[ Symbol.iterator ]() {
		for(let key in this) {
			if(key[ 0 ] !== '_') {
				yield [ key, this[ key ] ];
			}
		}
	}

	clone(deep = false, reducer) {
		if(deep) {
			return new this.constructor(reducer ? reducer(this) : deepCopy(this));
		}

		return new this.constructor({ ...this });
	}
	next({ ...state } = {}, merge = false) {
		if(merge === true) {
			return new this.constructor({ ...this, ...state });
		}

		return new this.constructor({ ...state });
	}
};

export default Component;