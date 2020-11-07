class User {
  constructor(id) {
    this.id = id;
    this.cuisine = [];
    this.payment = '';
  }

  saveAnswer(poll, answer) {
    switch (poll.category) {
      case 'cuisine':
        answer.option_ids.forEach((id) => {
          this.cuisine.push(poll.options[id]);
        });
        break;
      case 'payment':
        this.payment = poll.options[answer.option_ids[0]];
        break;
      default:
        throw new Error('Error in User class saveAnswer');
    }
  }
}

module.exports = User;
