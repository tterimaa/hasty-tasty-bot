const openPolls = {};

const polls = [
  {
    question: 'What kind of food would you like?',
    options: ['mexican', 'indian', 'lihapulla'],
  },
  {
    question: 'What kind of food would you like?',
    options: ['mexican', 'indian', 'lihapulla'],
  },
];

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
  poll.total_voter_count += 1;
};

const deletePollsByChat = (chatId) => {
  const open = findOpenPollsByChat(chatId);
  open.forEach((poll) => delete openPolls[poll.id]);
};

const sendPolls = async (chatId, bot) => {
  // eslint-disable-next-line max-len
  const promises = polls.map(({ question, options }) => bot.sendPoll(chatId, question, options, { is_anonymous: false }));
  const responses = await Promise.all(promises);
  responses.forEach((res) => {
    openPolls[res.poll.id] = { chat_id: chatId, ...res.poll };
  });
};

module.exports = {
  openPolls, sendPolls, isEverybodyAnswered, updatePoll, deletePollsByChat,
};
