const { createRobot } = require('probot')

const plugin = require('..')

const payload = require('./fixtures/pr-payload.json')

describe('cla-check', () => {
  let robot
  let github
  const notFound = new Error('Not Found')
  notFound.code = 404
  const configFile = `
  url: https://gist.githubusercontent.com/outsideris/3219615d9fc251aaf29177d3eb7c1981/raw/84650bac1cec3941952743e2c35d3e276c834eec/cla-test.txt
  `

  beforeEach(() => {
    robot = createRobot()
    plugin(robot)

    github = {
      repos: {
        getContent: jest.fn().mockReturnValue({
          data: {
            content: Buffer.from(configFile).toString('base64')
          }
        }),
        compareCommits: jest.fn().mockReturnValue(Promise.resolve({
          data: {
            commits: [
              {
                sha: 'be7ef9a',
                commit: {
                  author: { name: 'John', email: 'john@example.com' },
                  committer: { name: 'John', email: 'john@example.com' },
                  message: 'this is commit message'
                }
              }
            ]
          }
        }))
      }
    }
    robot.auth = () => Promise.resolve(github)
  })

  it('check committers and leave a comment', async () => {
    await robot.receive(payload)
  })
})
