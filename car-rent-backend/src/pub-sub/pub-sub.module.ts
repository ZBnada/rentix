import { Global, Module } from '@nestjs/common';
import { CustomPubSub } from './custom-pub-sub';

@Global()
@Module({
	providers: [
		{
			provide: 'PUB_SUB',
			//useClass: PubSub,
			useValue: new CustomPubSub(),
			// useFactory: () => {
			//  return new PubSub();
			// }
		},
	],
	exports: ['PUB_SUB'],
})
export class PubSubModule {}
