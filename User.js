class User {
  constructor(id) {
    this.id = id;
    this.cuisine = [];
    this.payment = '';
  }

  addCuisine(name) {
    this.cuisine.push(name);
  }
}

module.exports = User;
