const User = require('./User');

// Subgroup for hungry people in the group
class Group {
  constructor(id) {
    this.id = id;
    this.users = [];
  }

  addUser(id) {
    const user = new User(id);
    if (!this.users.map((usr) => usr.id).includes(id)) {
      this.users.push(user);
    }
  }

  getUser(id) {
    const userToReturn = this.users.find((usr) => usr.id === id);
    if (userToReturn) return userToReturn;
    throw new Error('User not found in group');
  }

  getSize() {
    return this.users.length;
  }
}

module.exports = Group;
