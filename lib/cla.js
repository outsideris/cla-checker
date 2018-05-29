const { parse } = require('url')
const uniqBy = require('lodash.uniqby')

module.exports = {
  extractCommitters: (commits) => {
    let committers = commits.map((c) => {
      return [
        { name: c.commit.author.name, email: c.commit.author.email },
        { name: c.commit.committer.name, email: c.commit.committer.email }
      ]
    })
    committers = [].concat(...committers) // flatten
    committers = uniqBy(committers, c => `${c.name}{c.email}`) // unique

    return committers
  },
  fetchList: (url, cb) => {
    const parsed = parse(url)
    let request
    if (parsed.protocol === 'https:') {
      request = require('https')
    } else {
      request = require('http')
    }

    request.get(url, (res) => {
      const { statusCode } = res

      if (statusCode !== 200) {
        res.resume()
        throw new Error('Fetch email list Failed.\n' + `Status Code: ${statusCode}`)
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        try {
          cb(null, rawData.split('\n'))
        } catch (e) {
          throw e
        }
      })
    }).on('error', (e) => {
      throw e
    })
  }
}
