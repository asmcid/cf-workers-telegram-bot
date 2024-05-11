import Handler from '../../main/src/handler';
import TelegramBot from '../../main/src/telegram_bot';
import TelegramWebhook from '../../main/src/telegram_webhook';
import { describe, it, expect } from 'vitest';

const from = {
	id: 1,
	is_bot: false,
	first_name: 'Enrico',
	last_name: 'Fermi',
};

const chat = {
	id: 1,
	type: 'private',
	first_name: 'Enrico',
	last_name: 'Fermi',
};

let update_id = 1;
let message_id = 1;

const fetch = (url: URL) => {
	switch (url.origin) {
		case 'localhost':
			switch (url.pathname) {
				// mock webhook
				case '15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225':
					return new Response('ok');
				default:
					break;
			}
			break;
		// mock telegram api
		// TODO: check for a valid token
		// TODO: check for a valid command
		// TODO: check for valid command parameters
		case 'api.telegram.org':
			return new Response('ok');
		default:
			break;
	}
};

const Fixtures = {
	message: {
		text: () => ({
			update_id: update_id++,
			message: {
				message_id: message_id++,
				date: Date.now(),
				from: { ...from },
				chat: { ...chat },
				text: 'foo',
			},
		}),
	},
};

const createRequest = new Request('http://localhost/15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225', {
	method: 'POST',
	body: JSON.stringify(Fixtures.message.text()),
});
// sha256("123456789") == 15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225

const createHandler = () =>
	new Handler([
		{
			bot_name: '@bot',
			api: TelegramBot,
			webhook: new TelegramWebhook(new URL(`https://api.telegram.org/bot${123456789}`), '123456789', new URL(new URL('localhost').origin)),
			commands: {},
		},
	]);

// tests are here
expect(createHandler().handle(createRequest)).toBe(new Response('ok'));

export default { fetch, createRequest, createHandler, Fixtures };
