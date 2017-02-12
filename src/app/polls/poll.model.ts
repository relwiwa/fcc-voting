// Typescript Shortcut for class declaration and initiation

export class Poll {
  constructor(
    public question: string,
    public options: string[],
    public voters: string[],
    public creatorId: string,
    public created?: Date,
    public pollId?: string
  ) {}
}