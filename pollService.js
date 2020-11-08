const Poll = require('./Poll');

const openPolls = {};

const polls = [
  {
    category: 'cuisine',
    question: 'What kind of food would you like?',
    options: ['Mexican', 'American', 'Burgers', 'Sushi', 'Pizzeria'],
  },
  {
    category: 'payment',
    question: 'How would you like to pay?',
    options: ['cash', 'VISA', 'MasterCard-Eurocard'],
  },
];

const getOpenPoll = (pollId) => {
  if (openPolls[pollId]) return openPolls[pollId];
  throw new Error('Poll not found');
};

const findOpenPollsByChat = (chatId) => {
  const arr = Object.values(openPolls);
  if (arr.length > 0) {
    return arr.filter((poll) => poll.chat_id === chatId);
  }
  throw new Error(`No open polls for chat id ${chatId}`);
};

const isEverybodyAnswered = (chatId, membersCount) => {
  let pollsCompleted = 0;
  findOpenPollsByChat(chatId).forEach((poll) => {
    if (poll.total_voter_count === membersCount) pollsCompleted += 1;
  });
  if (pollsCompleted === polls.length) return true;
  return false;
};

const updatePoll = (answer) => {
  const poll = openPolls[answer.poll_id];
  poll.incrementVoters();
};

const deletePollsByChat = (chatId) => {
  const open = findOpenPollsByChat(chatId);
  if (open.length === 0) throw new Error('There are no polls to delete');
  open.forEach((poll) => delete openPolls[poll.id]);
};

const sendPolls = async (chatId, bot) => polls.map(async ({ category, question, options }) => {
  const res = await bot.sendPoll(chatId, question, options, { is_anonymous: false });
  const newPoll = new Poll(res.poll.id, chatId, category, question, options);
  openPolls[newPoll.id] = newPoll;
});

module.exports = {
  openPolls, getOpenPoll, sendPolls, isEverybodyAnswered, updatePoll, deletePollsByChat,
};
