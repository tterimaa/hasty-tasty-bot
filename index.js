require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const openPolls = {};

const sendPolls = async (chatId) => {
  const res1 = await bot.sendPoll(chatId,
    'what kind of food would you like?',
    ['mexican', 'indian', 'lihapulla'],
    { is_anonymous: false });
  const res2 = await bot.sendPoll(chatId,
    'whats up?',
    ['good', 'bad', 'lihapulla'],
    { is_anonymous: false });
  openPolls[res1.poll.id] = {
    chat_id: chatId,
    ...res1.poll,
  };
  openPolls[res2.poll.id] = {
    chat_id: chatId,
    ...res2.poll,
  };
};

bot.on('message', async (msg) => {
  if (msg.text.toString().toLowerCase() === 'food') {
    bot.sendMessage(msg.chat.id, 'Let\'s find out a restaurant for you');
    sendPolls(msg.chat.id);
  }
});

bot.on('poll_answer', (answer) => {
  const poll = openPolls[answer.poll_id];
  bot.sendMessage(poll.chat_id, `${answer.user.first_name} answered a poll ${poll.question} with answer ${answer.option_ids.map((id) => poll.options[id].text)}`);
});
