const axios = require('axios')
const api = axios.create({
    baseURL: "https://api.github.com"
})
const issueRequest = {}

issueRequest.getByRepo = (repoName) => {
    return api.get('/repos/seita-ifce/hello-js-v3/issues').then(ret => {
        let matchIssues = ret.data.filter(i => i.title == repoName)
        return issueRequest.getByIssue(matchIssues[0].number).then(ret => {
            return ret
        })
    }).catch(err => {
        console.log(err)
    })
}

issueRequest.getByIssue = (issueNumber) => {
    return api.get('/repos/seita-ifce/hello-js-v3/issues/' + issueNumber + '/comments').then(ret => {
        let validComments = ret.data.filter(comment => new Date(comment.created_at) <= new Date('2017-09-23T23:59:59'))
        
        return validComments.filter(c => c.body.trim().startsWith('https://github.com/')).map(c => ({
            usuario: c.user.login,
            repo: c.body.trim(),
            episodio: 'e0' + issueNumber,
            date: new Date(c.created_at)
        }))
    }).catch(err => {
        console.log(err)
    })
}

module.exports = issueRequest