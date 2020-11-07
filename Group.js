const User = require('./User');

// Subgroup for hungry people in the group
class Group {
  constructor(id) {
    this.id = id;
    this.users = [];
  }

  addUser(id) {
    const user = new User(id);
    this.users.push(user);
  }

  getSize() {
    return this.users.length;
  }
}

module.exports = Group;
