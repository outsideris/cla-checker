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
      const comment = 'All committers have signed the CLA.'
      const params = context.issue({ body: comment })
      await context.github.issues.createComment(params)
    } else if (result.signedCommitters.length > 0) {
      const comment = 'Thank you for your submission, ' +
        'we really appreciate it. ' +
        'Like many open source projects, ' +
        'we ask that you all sign our Contributor License Agreement ' +
        'before we can accept your contribution.\n' +
        `${result.signedCommitters.length} out of ` +
        `${result.signedCommitters.length + result.unsignedCommitters.length} committers ` +
        'have signed the CLA'
      const params = context.issue({ body: comment })
      await context.github.issues.createComment(params)
    } else {
      const comment = 'Thank you for your submission, we really appreciate it. Like many open source projects, we ask that you sign our Contributor License Agreement before we can accept your contribution.'
      const params = context.issue({ body: comment })
      await context.github.issues.createComment(params)
    }
  }
}
