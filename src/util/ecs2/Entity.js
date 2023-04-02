import Component from "./Component";
import { Identity } from "./Identity";
import { deepCopy } from "./util/deepCopy";

/**
 * The Entity class is a container for components.  Because it can sometimes
 * be useful to witness *any* change to an entity, the Entity class is also
 * a proxy that can be observed for "set" and "delete" events.
 * 
 * Confer System for its own event variant and rationale.
 * > "I want to process effects when an Entity updates its state."
 */
export class Entity extends Identity {
	static Factory = (args = {}, qty = 1, clazz = this) => {
		if(Array.isArray(args)) {
			return Identity.Factory({ ...args }, qty, clazz);
		}

		return Identity.Factory(args, qty, clazz);
	};

	constructor ({ id, tags, observers = [], $tryName = true, ...components } = {}) {
		super({ id, tags });

		for(const [ name, component ] of Object.entries(components)) {
			let key;
			if($tryName === true) {
				key = component.$name || name;
			} else {
				key = name;
			}

			this[ key ] = component;
		}

		this.$observers = new Set(observers);

		return new Proxy(this, {
			get: (target, name) => {
				if(name[ 0 ] === "$") {
					return Reflect.get(target, name);
				}

				return target[ name ];
			},
			set: (target, name, value) => {
				if(name[ 0 ] === "$") {
					return Reflect.set(target, name, value);
				}

				let oldValue = deepCopy(target[ name ]);
				target[ name ] = value;

				for(const observer of target.$observers) {
					observer(target.$id, name, deepCopy(value), oldValue);
				}

				return true;
			},
			deleteProperty: (target, name) => {
				if(name[ 0 ] === "$") {
					return Reflect.deleteProperty(target, name);
				}

				let oldValue = deepCopy(target[ name ]);
				delete target[ name ];

				for(const observer of target.$observers) {
					observer(target.$id, name, undefined, oldValue);
				}

				return true;
			},
		});
	}

	$watch(...observers) {
		for(const observer of observers) {
			this.$observers.add(observer);
		}

		return this;
	}
	$unwatch(...observers) {
		for(const observer of observers) {
			this.$observers.delete(observer);
		}

		return this;
	}
};

export default Entity;