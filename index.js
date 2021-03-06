const { extractCommitters, fetchList, checkSigned } = require('./lib/cla')
const { signed, unsigned } = require('./lib/badge')

const wrongConfig = 'Although [CLA checker](https://github.com/outsideris/cla-checker) is configured,' +
  'it doesn\'t work. Please check `.github/cla-check.yml`.'

module.exports = async (robot) => {
  robot.on(['pull_request.opened', 'pull_request.synchronize'], check)

  async function check (context) {
    const config = await context.config('cla-check.yml', {})

    // required fields
    if (!config.signedListUrl || !config.claSignFormUrl) {
      // leave comment
      const params = context.issue({ body: wrongConfig })
      await context.github.issues.createComment(params)
      return
    }

    const pr = context.payload.pull_request

    const compare = await context.github.repos.compareCommits(context.repo({
      base: pr.base.sha,
      head: pr.head.sha
    }))

    const committers = await extractCommitters(compare.data.commits)
    const signedList = await fetchList(config.signedListUrl)
    const result = await checkSigned(committers, signedList)

    let comment = ''

    if (result.allSigned) {
      comment = `<a href="${config.claSignFormUrl}">` +
        `<img src="${process.env.HOST}/badge/signed.svg"></a>\n` +
        'All committers have signed the CLA.'
    } else if (result.signedCommitters.length > 0) {
      comment = `<a href="${config.claSignFormUrl}">` +
        `<img src="${process.env.HOST}/badge/unsigned.svg"></a>\n` +
        'Thank you for your submission, ' +
        'we really appreciate it. ' +
        'Like many open source projects, ' +
        'we ask that you all sign our Contributor License Agreement ' +
        'before we can accept your contribution.\n' +
        `${result.signedCommitters.length} out of ` +
        `${result.signedCommitters.length + result.unsignedCommitters.length} committers ` +
        'have signed the CLA\n\n' +
        result.signedCommitters.map(c => `:white_check_mark: ${c.name}\n`).join('') +
        result.unsignedCommitters.map(c => `:x: ${c.name}\n`).join('')
    } else {
      comment = `<a href="${config.claSignFormUrl}">` +
        `<img src="${process.env.HOST}/badge/unsigned.svg"></a>\n` +
        'Thank you for your submission, we really appreciate it. Like many open source projects, we ask that you sign our Contributor License Agreement before we can accept your contribution.'
    }

    // leave comment
    const params = context.issue({ body: comment })
    await context.github.issues.createComment(params)

    // update status
    const status = Object.assign({
      sha: pr.head.sha,
      context: 'CLA-checker'
    }, {
      state: result.allSigned ? 'success' : 'failure',
      description: result.allSigned
        ? 'Contributor License Agreement is signed.'
        : 'Contributor License Agreement is not signed yet.',
      target_url: 'https://github.com/outsideris/cla-checker'
    })

    return context.github.repos.createStatus(context.repo(status))
  }

  // routes
  const app = robot.route('/badge')

  app.get('/signed.svg', (req, res) => {
    res.end(signed)
  })

  app.get('/unsigned.svg', (req, res) => {
    res.end(unsigned)
  })
}
