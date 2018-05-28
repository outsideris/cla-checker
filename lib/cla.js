const { parse } = require('url')

module.exports = {
  extractEmails: (commits) => {
    let emails = commits.map((c) => {
      return [c.commit.author.email, c.commit.committer.email]
    })
    emails = [].concat(...emails) // flatten
    emails = [...(new Set(emails))] // unique

    return emails
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
