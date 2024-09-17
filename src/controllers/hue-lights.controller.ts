import { env } from '@/env.ts';
import { logger } from '@/utils/log.ts';
import { Bridge } from 'hue';
import { BridgeResponse } from 'hue/dist/src/interfaces/ApiResonse.interface.js';
import pTimeout from 'p-timeout';
import * as rc from 'recolors';

/**
 * Responsible for setting up and managing the Hue bridge.
 */
export namespace HueLightsController {
	const log = logger('[Hue]');

	let ready = false;
	let bridge: Bridge | undefined = undefined;

	async function setup() {
		if (ready) return;

		if (!env.HUE_IP || !env.HUE_USER) {
			ready = true;
			return;
		}

		bridge = new Bridge({
			internalipaddress: env.HUE_IP,
		} as BridgeResponse);

		try {
			await bridge.authenticate(env.HUE_USER);
			await pTimeout(bridge.request({ url: '/lights' }), { milliseconds: 2000 });
			log('Bridge is authenticated and ready');
			ready = true;
		} catch (e) {
			log(rc.red('Bridge authentication failed, is the IP and user correct?'));
			process.exit(1);
		}
	}

	setup();

	export function getBridge() {
		return new Promise<Bridge | undefined>((res) => {
			while (!ready) continue;
			res(bridge);
		});
	}
}
