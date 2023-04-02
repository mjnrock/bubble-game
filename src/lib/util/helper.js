export function deepCopy(obj) {
	if(obj === null || typeof obj !== "object") {
		return obj;
	}

	return JSON.parse(JSON.stringify(obj));
};

export function flatten(obj, prefix = '', toArray = true) {
	return Object.keys(obj).reduce((acc, key) => {
		const pre = prefix.length ? prefix + '.' : '';
		if(typeof obj[ key ] === 'object' && obj[ key ] !== null) {
			Object.assign(acc, flatten(obj[ key ], pre + key, toArray));
		} else {
			const newKey = pre + key;
			if(toArray) {
				acc.push([ newKey, obj[ key ] ]);
			} else {
				acc[ newKey ] = obj[ key ];
			}
		}
		return acc;
	}, toArray ? [] : {});
};

export function delta(current, next, asObject = false) {
	const flatCurr = flatten(current);
	const flatNext = flatten(next);

	if(asObject) {
		return Object.keys(flatCurr).reduce((acc, key) => {
			if(flatCurr[ key ] !== flatNext[ key ]) {
				acc[ key ] = flatNext[ key ];
			}

			return acc;
		}, {});
	} else {
		return Object.keys(flatCurr).reduce((acc, key) => {
			if(flatCurr[ key ] !== flatNext[ key ]) {
				acc.push(flatNext[ key ]);
			}

			return acc;
		}, []);
	}
}


export default {
	deepCopy,
	flatten,
	delta,
};