import { FccVotingPage } from './app.po';

describe('fcc-voting App', function() {
  let page: FccVotingPage;

  beforeEach(() => {
    page = new FccVotingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
