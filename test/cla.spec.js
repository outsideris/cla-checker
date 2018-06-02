const { extractCommitters, fetchList, checkSigned } = require('../lib/cla')

test('extract a email from commits', async () => {
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

  const committers = await extractCommitters(commits)

  expect(committers).toHaveLength(1)
  expect(committers[0].email).toBe('me@example.com')
})

test('extract an make unique emails from commits', async () => {
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

  const committers = await extractCommitters(commits)

  expect(committers).toHaveLength(3)
})

test('fetch email list from given url', async () => {
  const list = 'https://gist.githubusercontent.com/outsideris/829ec0dff2533b42695e96072734f947/raw/fd009e8281fb8c4b37a931c064e7195213659c42/signed.txt'
  const emails = await fetchList(list)

  expect(emails).toHaveLength(4)
})

test('check all committers signed', async () => {
  const committers = [
    { name: 'John', email: 'john@example.com' },
    { name: 'Jane', email: 'jane@example.com' }
  ]
  const list = [ 'john@example.com', 'jane@example.com' ]

  const result = await checkSigned(committers, list)

  expect(result.allSigned).toBeTruthy()
  expect(result.signedCommitters).toHaveLength(2)
  expect(result.unsignedCommitters).toHaveLength(0)
})

test('check committers\'s sign if some is not', async () => {
  const committers = [
    { name: 'John', email: 'john@example.com' },
    { name: 'User', email: 'user@example.com' }
  ]
  const list = [ 'john@example.com', 'jane@example.com' ]

  const result = await checkSigned(committers, list)

  expect(result.allSigned).toBeFalsy()
  expect(result.signedCommitters).toHaveLength(1)
  expect(result.unsignedCommitters).toHaveLength(1)
})
