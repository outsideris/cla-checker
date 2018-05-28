module.exports = {
  extractEmails: (commits) => {
    let emails = commits.map((c) => {
      return [c.commit.author.email, c.commit.committer.email]
    })
    emails = [].concat(...emails) // flatten
    emails = [...(new Set(emails))] // unique

    return emails
  }
}
