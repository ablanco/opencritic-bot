// Copyright (c) 2023 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

import { Telegraf } from 'telegraf';
import Settings from './src/settings.js';

import { search } from './src/client.js';

const bot = new Telegraf(Settings.token);

const helpHTML = [
    'This bot is meant to be use in inline mode.',
    'Call it in any conversation with @opencriticbot',
].join('\n');

bot.command('start', (ctx) => {
    ctx.replyWithHTML(helpHTML);
});
bot.command('help', (ctx) => {
    ctx.replyWithHTML(helpHTML);
});

bot.on('inline_query', async (ctx) => {
    const query = ctx.inlineQuery.query;

    if (query) {
        const results = await search(query);
        ctx.answerInlineQuery(results);
    }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
