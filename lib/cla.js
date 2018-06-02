const { parse } = require('url')
const uniqBy = require('lodash.uniqby')

module.exports = {
  extractCommitters: async (commits) => {
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
  fetchList: (url) =>
    new Promise((resolve, reject) => {
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
          reject(new Error('Fetch email list Failed.\n' + `Status Code: ${statusCode}`))
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          try {
            resolve(rawData.split('\n'))
          } catch (e) {
            reject(e)
          }
        })
      }).on('error', (e) => {
        reject(e)
      })
    }),
  checkSigned: async (committers, signedList) => {
    const signedCommitters = []
    const unsignedCommitters = []
    committers.forEach(c => {
      if (signedList.includes(c.email)) {
        signedCommitters.push(c)
      } else {
        unsignedCommitters.push(c)
      }
    })

    return {
      allSigned: !unsignedCommitters.length,
      signedCommitters,
      unsignedCommitters
    }
  }
}
