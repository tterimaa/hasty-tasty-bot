const Poll = require('./Poll');

const openPolls = {};

const polls = [
  {
    category: 'cuisine',
    question: 'What kind of food would you like?',
    options: ['Mexican', 'American', 'Burgers'],
  },
  {
    category: 'payment',
    question: 'How would you like to pay?',
    options: ['cash', 'VISA'],
  },
];

const getOpenPoll = (pollId) => {
  if (openPolls[pollId]) return openPolls[pollId];
  throw new Error('Poll not found');
};

const findOpenPollsByChat = (chatId) => {
  const filtered = Object.values(openPolls)
    .filter((poll) => poll.chat_id === chatId);
  return filtered;
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
