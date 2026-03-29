import { PubSub, PubSubOptions } from 'graphql-subscriptions';
import { EventEmitter } from 'events';

export class CustomPubSub extends PubSub {
	id: string;

	constructor(options?: PubSubOptions) {
		const biggerEventEmitter = new EventEmitter();
		biggerEventEmitter.setMaxListeners(50);
		if (!options) {
			options = {};
		}
		options.eventEmitter = biggerEventEmitter;
		super(options);
	}

	override publish(triggerName: string, payload: any): Promise<void> {
		return super.publish(triggerName, payload);
	}
}
