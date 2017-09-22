const knex = require('./db').knex
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const axios = require("axios")

issueRequest = require('./issue_request')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/pessoas/list', (req, res) => {
    knex('pessoa').select().then(ret => {
        res.send(ret)
    }).catch(err => {
        Response.status(500).send(err)
    })
})

app.post('/dosave', (req, res) => {
    res.send(`
    <h2>Olá, ${req.body.nome}!</h2>
    <a href="index2.html">voltar</a>
  `)
})

app.post('/presenca', (req, res) => {
    let data = req.body.repo

    if (data) {
        data = data.toUpperCase()
        issueRequest.getByRepo(data).then(ret => insert(ret))
    } else {
        data = req.body.issue
        issueRequest.getByIssue(data).then(ret => insert(ret))
    }
})

app.get('/presenca', (req, res) => {
    knex('presenca').select().then(ret => {
        res.send(ret)
    })
})

insert = (users) => {
    if (users.length > 0) {
        users.forEach(user => {
            knex('presenca').select().where({
                usuario: user.usuario,
                episodio: user.episodio
            }).then(ret => {
                if (!ret.length) {
                    knex('presenca').insert(user).then(_ => {
                        console.log('Dados inseridos na tabela.')
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        })
    }
}

knex.migrate.latest().then(_ => {
    console.log('Schema do banco atualizado.')
    app.listen(3000, _ => {
        console.log('[Express app - ONLINE]')
    })
})


