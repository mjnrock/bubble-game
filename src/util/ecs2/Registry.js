import { v4 as uuid, validate } from "uuid";
import Identity from "./Identity";

export class Registry extends Identity {
	static Factory = (args = {}, qty = 1, clazz = this) => {
		return Identity.Factory(args, qty, clazz);
	};

	constructor ({ entries = [], id, tags = [] } = {}) {
		super({ id, tags });

		this.$entries = new Map(entries);

		return new Proxy(this, {
			get(target, prop) {
				if(prop[ 0 ] === "$") {
					return Reflect.get(target, prop);
				}

				if(!validate(prop)) {
					let uuid = target.$entries.get(prop);

					if(uuid instanceof Set) {
						return Array.from(uuid).map(id => target.$entries.get(id));
					} else if(validate(uuid)) {
						return target.$entries.get(uuid);
					}
				}

				return target.$entries.get(prop);
			},
		});
	}

	/**
	 * Iterates over the *resolved* entries in the registry.
	 */
	*[ Symbol.iterator ]() {
		for(let [ key, value ] of this.$entries.entries()) {
			if(validate(key)) {
				yield value;
			} else if(value instanceof Set) {
				yield Array.from(value).map(v => this.$entries.get(v));
			} else {
				yield this.$entries.get(value);
			}
		}
	}

	$register(...identitiesOrFns) {
		for(let input of identitiesOrFns) {
			if(input instanceof Identity) {
				this.$entries.set(input.$id, input);
			} else if(typeof input === "function") {
				this.$entries.set(uuid(), input);
			}
		}

		return this;
	}
	$unregister(...identitiesOrFns) {
		for(let input of identitiesOrFns) {
			if(input instanceof Identity) {
				let uuid = input.$id;
				this.$entries.delete(uuid);

				for(let [ key, value ] of this.$entries.entries()) {
					if(value instanceof Set) {
						value.delete(uuid);
					} else if(value === uuid) {
						this.$entries.delete(key);
					}
				}
			} else if(typeof input === "function") {
				let uuid;
				for(let [ key, value ] of this.$entries.entries()) {
					if(value === input) {
						uuid = key;
						break;
					}
				}

				this.$entries.delete(uuid);

				for(let [ key, value ] of this.$entries.entries()) {
					if(value instanceof Set) {
						value.delete(uuid);
					} else if(value === uuid) {
						this.$entries.delete(key);
					}
				}
			}
		}

		return this;
	}

	$addAlias(identityOrUuid, ...aliases) {
		for(let alias of aliases) {
			let uuid;
			if(identityOrUuid instanceof Identity) {
				uuid = identityOrUuid.$id;
			} else if(validate(identityOrUuid)) {
				uuid = identityOrUuid;
			}

			if(this.$entries.has(uuid)) {
				this.$entries.set(alias, uuid);
			}
		}

		return this;
	}
	$removeAlias(...aliases) {
		for(let alias of aliases) {
			this.$entries.delete(alias);
		}

		return this;
	}

	$addToPool(poolName, ...identityOrUuids) {
		if(!this.$entries.has(poolName)) {
			this.$entries.set(poolName, new Set());
		}

		let pool = this.$entries.get(poolName);
		for(let identityOrUuid of identityOrUuids) {
			let uuid;
			if(identityOrUuid instanceof Identity) {
				uuid = identityOrUuid.$id;
			} else if(validate(identityOrUuid)) {
				uuid = identityOrUuid;
			}

			if(this.$entries.has(uuid)) {
				pool.add(uuid);
			}
		}

		return this;
	}
	$removeFromPool(poolName, ...identityOrUuids) {
		if(!this.$entries.has(poolName)) {
			return this;
		}

		let pool = this.$entries.get(poolName);
		for(let identityOrUuid of identityOrUuids) {
			let uuid;
			if(identityOrUuid instanceof Identity) {
				uuid = identityOrUuid.$id;
			} else if(validate(identityOrUuid)) {
				uuid = identityOrUuid;
			}

			pool.delete(uuid);
		}

		if(pool.size === 0) {
			this.$entries.delete(poolName);
		}

		return this;
	}
	$setPool(poolName, ...identityOrUuids) {
		this.$entries.set(poolName, new Set());

		let pool = this.$entries.get(poolName);
		for(let identityOrUuid of identityOrUuids) {
			let uuid;
			if(identityOrUuid instanceof Identity) {
				uuid = identityOrUuid.$id;
			} else if(validate(identityOrUuid)) {
				uuid = identityOrUuid;
			}

			pool.add(uuid);
		}

		return this;
	}
};

export default Registry;