export class Poll {
  question: string;
  options: string[];
  created: Date;
  creatorId: string;
  pollId: string;

  constructor(question: string, options: string[], created: Date, creatorId: string, pollId?: string) {
    this.question = question;
    this.options = options;
    this.created = created;
    this.creatorId = creatorId;
    this.pollId = pollId;
  }
}