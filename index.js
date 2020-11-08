require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const aitoService = require('./aitoService');
const groupService = require('./groupService');
const pollService = require('./pollService');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/food/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Let’s find you all a place to eat!');
  groupService.addGroup(msg.chat.id);
  bot.sendMessage(msg.chat.id, 'Please say /hungry if you would like to join');
});

bot.onText(/\/hungry/, (msg) => {
  let group;
  try {
    group = groupService.findGroup(msg.chat.id);
    group.addUser(msg.from.id);
    bot.sendMessage(msg.chat.id, `Looks like ${group.getSize()} persons are up for a meal. Say /done if no one else is hungry`);
  } catch (err) {
    bot.sendMessage('If you want me to suggest a restaurant for your group, please say "/food" first');
  }
});

bot.onText(/\/done/, (msg) => {
  try {
    const group = groupService.findGroup(msg.chat.id);
    pollService.sendPolls(msg.chat.id, bot);
    bot.sendMessage(msg.chat.id, `I need answers from ${group.getSize()} persons to continue. Please say /quit if you want to stop`);
  } catch (error) {
    console.error(error);
  }
});

bot.onText(/\/quit/, (msg) => {
  pollService.deletePollsByChat(msg.chat.id);
  pollService.deleteGroup(msg.chat.id);
});

const sendRestaurantInfo = (chatId, data) => {
  const restaurant = Object.values(data)[0];

  if (restaurant.latitude && restaurant.longitude) {
    bot.sendLocation(chatId, restaurant.latitude, restaurant.longitude);
  }

  if (restaurant.name) {
    bot.sendMessage(chatId, `<b>${restaurant.name}</b>`, { parse_mode: 'HTML' });
  }
};

bot.on('poll_answer', async (answer) => {
  try {
    const poll = pollService.getOpenPoll(answer.poll_id);
    pollService.updatePoll(answer);
    const group = groupService.findGroup(poll.chat_id);
    const user = group.getUser(answer.user.id);
    user.saveAnswer(poll, answer);

    if (pollService.isEverybodyAnswered(poll.chat_id, group.getSize())) {
      const res = await aitoService.callAito({ users: group.users });
      sendRestaurantInfo(poll.chat_id, res.data);
      pollService.deletePollsByChat(poll.chat_id);
      groupService.deleteGroup(poll.chat_id);
    }
  } catch (error) {
    console.error(error);
  }
});
