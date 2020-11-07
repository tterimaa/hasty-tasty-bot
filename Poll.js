class Poll {
  constructor(id, chatId, category, question, options) {
    this.id = id;
    this.chat_id = chatId;
    this.category = category;
    this.question = question;
    this.options = options;
    this.total_voter_count = 0;
  }

  incrementVoters() {
    this.total_voter_count += 1;
  }
}

module.exports = Poll;
