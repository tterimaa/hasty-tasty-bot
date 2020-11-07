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

const deleteGroup = (chatId) => {
  if (groups[chatId]) delete groups[chatId];
};

module.exports = {
  groups, addGroup, findGroup, deleteGroup,
};
