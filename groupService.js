const Group = require('./Group');

const groups = {};

const addGroup = (chatId) => {
  const group = new Group(chatId);
  groups[chatId] = group;
};

const findGroup = (chatId) => {
  if (groups[chatId]) return groups[chatId];
  throw new Error('Group not found');
};

module.exports = { addGroup, findGroup };
