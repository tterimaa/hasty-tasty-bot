require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const pollService = require('./pollService');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  if (msg.text.toString().toLowerCase() === 'food') {
    bot.sendMessage(msg.chat.id, 'Let\'s find out a restaurant for you');
    pollService.sendPolls(msg.chat.id, bot);
  }
});

bot.on('poll_answer', (answer) => {
  const poll = pollService.openPolls[answer.poll_id];
  bot.sendMessage(poll.chat_id, `${answer.user.first_name} answered a poll ${poll.question} with answer ${answer.option_ids.map((id) => poll.options[id].text)}`);
});
