import { Identity } from "./Identity";

/**
 * The System class should perform all CRUD operations on Components 
 * in Entity containers.  Because it can sometimes be useful to witness
 * when *specific* events occur, the System also provides a subscription
 * mechanism for observing events.
 * 
 * Confer Entity for its own event variant and rationale.
 * > "I want to process effects when a System event is invoked."
 */
export class System extends Identity {
	static Factory = (args = {}, qty = 1, clazz = this) => {
		return Identity.Factory(args, qty, clazz);
	};

	constructor ({ id, tags, subscribers = [] } = {}) {
		super({ id, tags });

		this.$subscribers = new Map(subscribers);
	}

	$subscribe(event, ...subscribers) {
		let subscriptions = this.$subscribers.get(event) || [];

		for(const subscriber of subscribers) {
			subscriptions.push(subscriber);
		}

		this.$subscribers.set(event, subscriptions);

		return this;
	}
	$unsubscribe(event, ...subscribers) {
		let subscriptions = this.$subscribers.get(event) || [];

		subscriptions = subscriptions.filter((fn) => !subscribers.includes(fn));

		this.$subscribers.set(event, subscriptions);

		if(subscriptions.length === 0) {
			this.$subscribers.delete(event);
		}

		return this;
	}


	$broadcast(event, ...args) {
		let subscribers = this.$subscribers.get(event) || [];

		for(const subscriber of subscribers) {
			subscriber(event, ...args);
		}

		return this;
	}
};

export default System;