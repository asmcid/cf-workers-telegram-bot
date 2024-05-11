var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import Handler from '../../main/src/handler';
import TelegramBot from '../../main/src/telegram_bot';
import TelegramWebhook from '../../main/src/telegram_webhook';
import { expect } from 'vitest';
var from = {
    id: 1,
    is_bot: false,
    first_name: 'Enrico',
    last_name: 'Fermi',
};
var chat = {
    id: 1,
    type: 'private',
    first_name: 'Enrico',
    last_name: 'Fermi',
};
var update_id = 1;
var message_id = 1;
var fetch = function (url) {
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
var Fixtures = {
    message: {
        text: function () { return ({
            update_id: update_id++,
            message: {
                message_id: message_id++,
                date: Date.now(),
                from: __assign({}, from),
                chat: __assign({}, chat),
                text: 'foo',
            },
        }); },
    },
};
var createRequest = new Request('http://localhost/15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225', {
    method: 'POST',
    body: JSON.stringify(Fixtures.message.text()),
});
// sha256("123456789") == 15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225
var createHandler = function () {
    return new Handler([
        {
            bot_name: '@bot',
            api: TelegramBot,
            webhook: new TelegramWebhook(new URL("https://api.telegram.org/bot".concat(123456789)), '123456789', new URL(new URL('localhost').origin)),
            commands: {},
        },
    ]);
};
// tests are here
expect(createHandler().handle(createRequest)).toBe(new Response('ok'));
export default { fetch: fetch, createRequest: createRequest, createHandler: createHandler, Fixtures: Fixtures };
