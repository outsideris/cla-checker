const { extractCommitters, fetchList, checkSigned } = require('./lib/cla')

module.exports = async (robot) => {
  robot.on(['pull_request.opened', 'pull_request.synchronize'], check)

  async function check (context) {
    const config = await context.config('cla-check.yml', {})

    const pr = context.payload.pull_request

    const compare = await context.github.repos.compareCommits(context.repo({
      base: pr.base.sha,
      head: pr.head.sha
    }))

    const committers = await extractCommitters(compare.data.commits)
    const signedList = await fetchList(config.url)
    const result = await checkSigned(committers, signedList)

    if (result.allSigned) {
      // TODO: leave comment to everybody signed
    } else if (result.signedCommitters.length > 0) {
      // TODO: leave comment to who doesn't signed
    } else {
      // TODO: leave comment to signing required
    }
  }
}
