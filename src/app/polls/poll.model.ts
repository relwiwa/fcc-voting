// Typescript Shortcut for class declaration and initiation

export class Poll {
  constructor(
    public question: string,
    public options: string[],
    public created: Date,
    public creatorId: string,
    public pollId?: string
  ) {}
}