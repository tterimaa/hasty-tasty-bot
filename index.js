require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const groupService = require('./groupService');
const pollService = require('./pollService');

const token = process.env.BOT_TOKEN;
const FLASK_API_URL = 'http://127.0.0.1:5000/json';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/food/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Let\'s find out a restaurant for your group');
  groupService.addGroup(msg.chat.id);
  bot.sendMessage(msg.chat.id, 'Please say /hungry if you would like to join');
});

bot.onText(/\/hungry/, (msg) => {
  let group;
  try {
    group = groupService.findGroup(msg.chat.id);
    group.addUser(msg.from.id);
    bot.sendMessage(msg.chat.id, `There is ${group.getSize()} hungry persons in the group. Please say /done if no one else is hungry`);
  } catch (err) {
    bot.sendMessage('If you want me to suggest a restaurant for your group, please say "/food" first');
  }
});

bot.onText(/\/done/, (msg) => {
  pollService.sendPolls(msg.chat.id, bot);
  const group = groupService.findGroup(msg.chat.id);
  bot.sendMessage(msg.chat.id, `I need answers from ${group.getSize()} persons to continue. Please say /quit if somebody is unable to answer`);
});

bot.onText(/\/quit/, (msg) => {
  pollService.deletePollsByChat(msg.chat.id);
  pollService.deleteGroup(msg.chat.id);
});

bot.on('poll_answer', async (answer) => {
  const poll = pollService.openPolls[answer.poll_id];
  pollService.updatePoll(answer);
  bot.sendMessage(poll.chat_id, `${answer.user.first_name} answered a poll ${poll.question} with answer ${answer.option_ids.map((id) => poll.options[id].text)}`);
  const group = groupService.findGroup(poll.chat_id);
  const user = group.getUser(answer.user.id);
  user.saveAnswer(poll, answer);
  if (pollService.isEverybodyAnswered(poll.chat_id, group.getSize())) {
    console.log('all answers received');
    const res = await axios
      .post(FLASK_API_URL, group.users);
    console.log(res);
    pollService.deletePollsByChat(poll.chat_id);
    groupService.deleteGroup(poll.chat_id);
  }
  console.log(pollService.openPolls);
  console.log(groupService.groups);
});
