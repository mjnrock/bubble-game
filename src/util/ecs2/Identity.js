import { v4 as uuid } from "uuid";

export class Identity {
	static Factory = (args = {}, qty = 1, clazz = this) => {
		let results = [];
		for(let i = 0; i < qty; i++) {
			if(typeof args === "function") {
				results.push(new clazz(args(i)));
			} else if(typeof args === "object") {
				results.push(new clazz(args));
			}
		}

		if(qty === 1) {
			return results[ 0 ];
		}

		return results;
	};

	constructor ({ id, tags = [] } = {}) {
		this.$id = id || uuid();
		this.$tags = new Set(tags);
	}

	$hasTag(...tags) {
		return tags.every(tag => this.$tags.has(tag));
	}
	$getTags() {
		return Array.from(this.$tags);
	}
	$addTag(...tags) {
		tags.forEach(tag => this.$tags.add(tag));

		return this;
	}
	$removeTag(...tags) {
		tags.forEach(tag => this.$tags.delete(tag));

		return this;
	}
};

export default Identity;