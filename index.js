require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cp = require('child_process');
const groupService = require('./groupService');
const pollService = require('./pollService');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  if (msg.text.toString().toLowerCase() === 'food') {
    bot.sendMessage(msg.chat.id, 'Let\'s find out a restaurant for you');
    groupService.addGroup(msg.chat.id);
    bot.sendMessage(msg.chat.id, 'Please say /hungry if you would like to join');
  }
});

bot.onText(/\/hungry/, (msg) => {
  let group;
  try {
    group = groupService.findGroup(msg.chat.id);
    group.addUser(msg.from.id);
    bot.sendMessage(msg.chat.id, `There is ${group.getSize()} hungry persons in the group. Please say /done if no one else is hungry`);
  } catch (err) {
    console.error(err);
    bot.sendMessage('If you want me to suggest a restaurant for your group, please say "food" first');
  }
});

bot.onText(/\/done/, (msg) => {
  pollService.sendPolls(msg.chat.id, bot);
});

const callPythonService = async (input) => {
  let dataToSend;
  const python = cp.spawn('python', ['script.py', input]);
  python.stdout.on('data', (data) => {
    console.log('Pipe data from python script');
    dataToSend = data.toString();
  });
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    console.log(dataToSend);
  });
};

bot.on('poll_answer', async (answer) => {
  const poll = pollService.openPolls[answer.poll_id];
  pollService.updatePoll(answer);
  bot.sendMessage(poll.chat_id, `${answer.user.first_name} answered a poll ${poll.question} with answer ${answer.option_ids.map((id) => poll.options[id].text)}`);
  const group = groupService.findGroup(poll.chat_id);
  const user = group.getUser(answer.user.id);
  user.addAnswer(poll, answer);
  if (pollService.isEverybodyAnswered(poll.chat_id, group.getSize())) {
    console.log('all answers received');
    console.group(group);
    callPythonService(JSON.stringify(group.users));
    pollService.deletePollsByChat(poll.chat_id);
  }
  console.log(pollService.openPolls);
});
