require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

bot.on('message', async msg => {
    if(msg.text.toString().toLowerCase() === 'food') {
        const res = await bot.sendPoll(msg.chat.id,
            'what kind of food would you like?',
            ['mexican', 'indian', 'lihapulla']);
        bot.sendMessage(msg.chat.id, `You answered ${res}`);
    }
})