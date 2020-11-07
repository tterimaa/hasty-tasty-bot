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

const isEverybodyAnswered = (chatId) => {
  findOpenPollsByChat(chatId).forEach((poll) => {
    console.log(poll.total_voter_count);
  });
};

const sendPolls = async (chatId, bot) => {
  // eslint-disable-next-line max-len
  const promises = polls.map(({ question, options }) => bot.sendPoll(chatId, question, options, { is_anonymous: false }));
  const responses = await Promise.all(promises);
  responses.forEach((res) => {
    openPolls[res.poll.id] = { chat_id: chatId, ...res.poll };
  });
};

module.exports = { openPolls, sendPolls, isEverybodyAnswered };
