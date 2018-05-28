const { extractEmails } = require('../lib/cla')

test('extract a email from commits', () => {
  const commits = [{
    sha: 'be7ef9a',
    commit: {
      author: {
        name: 'John',
        email: 'me@example.com',
        date: '2018-05-27T18:49:20Z'
      },
      committer: {
        name: 'John',
        email: 'me@example.com',
        date: '2018-05-27T18:49:20Z'
      },
      message: 'commit message',
      tree: {
        sha: '5866c90',
        url: 'https://api.github.com/repos/outsideris/cla-checker/git/trees/5866c90'
      },
      url: 'https://api.github.com/repos/outsideris/cla-checker/git/commits/be7ef9a',
      comment_count: 0,
      verification: {}
    },
    url: 'https://api.github.com/repos/outsideris/cla-checker/commits/be7ef9a',
    html_url: 'https://github.com/outsideris/cla-checker/commit/be7ef9a',
    comments_url: 'https://api.github.com/repos/outsideris/cla-checker/commits/be7ef9a/comments',
    author: {},
    committer: {},
    parents: [{}]
  }]

  const emails = extractEmails(commits)

  expect(emails).toHaveLength(1)
  expect(emails).toContain('me@example.com')
})

test('extract an make unique emails from commits', () => {
  const commits = [{
    sha: 'be7ef9a',
    commit: {
      author: {
        name: 'John',
        email: 'john@example.com',
        date: '2018-05-27T18:49:20Z'
      },
      committer: {
        name: 'Jane',
        email: 'jane@example.com',
        date: '2018-05-27T18:49:20Z'
      },
      message: 'commit message',
      tree: {
        sha: '5866c90',
        url: 'https://api.github.com/repos/outsideris/cla-checker/git/trees/5866c90'
      },
      url: 'https://api.github.com/repos/outsideris/cla-checker/git/commits/be7ef9a',
      comment_count: 0,
      verification: {}
    },
    url: 'https://api.github.com/repos/outsideris/cla-checker/commits/be7ef9a',
    html_url: 'https://github.com/outsideris/cla-checker/commit/be7ef9a',
    comments_url: 'https://api.github.com/repos/outsideris/cla-checker/commits/be7ef9a/comments',
    author: {},
    committer: {},
    parents: [{}]
  }, {
    sha: 'be7ef9b',
    commit: {
      author: {
        name: 'user',
        email: 'user@example.com',
        date: '2018-05-27T18:49:20Z'
      },
      committer: {
        name: 'user',
        email: 'user@example.com',
        date: '2018-05-27T18:49:20Z'
      },
      message: 'commit message',
      tree: {
        sha: '5866c90',
        url: 'https://api.github.com/repos/outsideris/cla-checker/git/trees/5866c90'
      },
      url: 'https://api.github.com/repos/outsideris/cla-checker/git/commits/be7ef9a',
      comment_count: 0,
      verification: {}
    },
    url: 'https://api.github.com/repos/outsideris/cla-checker/commits/be7ef9a',
    html_url: 'https://github.com/outsideris/cla-checker/commit/be7ef9a',
    comments_url: 'https://api.github.com/repos/outsideris/cla-checker/commits/be7ef9a/comments',
    author: {},
    committer: {},
    parents: [{}]
  }]

  const emails = extractEmails(commits)

  expect(emails).toHaveLength(3)
})
