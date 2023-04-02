export class Component {
	static Factory({ ...state } = {}, qty = 1, clazz) {
		let components = [];
		for(let i = 0; i < qty; i++) {
			components.push(new clazz({ ...state }));
		}

		if(qty === 1) {
			return components[ 0 ];
		}

		return components;
	}

	constructor ({ ...state } = {}) {
		for(let key in state) {
			this[ key ] = state[ key ]
		}
	}
};

export default Component;