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

  getUser(id) {
    return this.users.find((usr) => usr.id === id);
  }

  getSize() {
    return this.users.length;
  }
}

module.exports = Group;
