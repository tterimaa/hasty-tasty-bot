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
    bot.sendMessage(msg.chat.id, `I need answers from ${group.getSize()} persons to continue. Please say /quit if somebody is unable to answer`);
  } catch (error) {
    console.error(error);
  }
});

bot.onText(/\/quit/, (msg) => {
  pollService.deletePollsByChat(msg.chat.id);
  pollService.deleteGroup(msg.chat.id);
});

const sendRestaurantInfo = (chatId, data) => {
  const arr = Object.values(data).slice(0, 2);
  if (arr[0].latitude && arr[0].longitude && arr[0].latitude) {
    bot.sendLocation(chatId, arr[0].latitude, arr[0].longitude);
    bot.sendMessage(chatId, `<b>${arr[0].name}</b>`, { parse_mode: 'HTML' });
  } else if (arr[1].latitude && arr[1].longitude && arr[1].latitude) {
    bot.sendLocation(chatId, arr[1].latitude, arr[1].longitude);
    bot.sendMessage(chatId, arr[1].name);
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
      console.log(`Response from aito ${res}`);
      sendRestaurantInfo(poll.chat_id, res.data);
      pollService.deletePollsByChat(poll.chat_id);
      groupService.deleteGroup(poll.chat_id);
    }
  } catch (error) {
    console.error(error);
  }
});
