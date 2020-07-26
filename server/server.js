import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'

import React from 'react'
import axios from 'axios'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const { readFile, stat, writeFile, unlink } = require('fs').promises

const Root = () => ''

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))
  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  // console.log(Root)
} catch (ex) {
  // console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const URL = 'https://jsonplaceholder.typicode.com/users'

const getRemoteUsers = async (url) => {
  const { data: users } = await axios(url)
  return JSON.stringify(users)
}

const readLocalUsers = async (fileName) => {
  const fileExists = await stat(`${__dirname}/${fileName}`)
    .then((data) => data)
    .catch((err) => `${err.code}`)
  if (fileExists !== 'ENOENT') {
    const result = await readFile(`${__dirname}/${fileName}`, { encoding: 'utf8' })
      .then((users) => users)
      .catch((err) => `${err.code} ${err.message}`)

    return result
  }
  const response = await getRemoteUsers(URL)

  writeFile(`${__dirname}/${fileName}`, response, { encoding: 'utf8' })

  return response
}

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

server.use((req, res, next) => {
  res.set('x-skillcrucial-user', '3f05ffed-e648-4545-bb6c-a70118fca01a')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
})

server.get('/api/v1/users', async (req, res) => {
  const readUsers = await readLocalUsers('../users.json')
  res.json(JSON.parse(readUsers))
})

server.post('/api/v1/users', async (req, res) => {
  const result = await readFile(`${__dirname}/../users.json`, { encoding: 'utf8' })
    .then((users) => users)
    .catch((err) => `${err.code} ${err.message}`)

  unlink(`${__dirname}/../users.json`, (err) => {
    if (err) throw err
  })
  const userData = req.body
  const data = JSON.parse(result)
  const getLastElId = data[data.length - 1].id
  userData.id = getLastElId + 1
  const newData = [...data, userData]

  const newResponse = JSON.stringify(newData)
  writeFile(`${__dirname}/../users.json`, newResponse, { encoding: 'utf8' })
  res.json({ status: 'success', id: getLastElId + 1 })
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const userId = Number(req.params.userId)

  const result = await readFile(`${__dirname}/../users.json`, { encoding: 'utf8' })
    .then((users) => users)
    .catch((err) => `${err.code} ${err.message}`)

  unlink(`${__dirname}/../users.json`, (err) => {
    if (err) throw err
  })
  const userData = req.body
  const data = JSON.parse(result)
  const newData = data.reduce((acc, cur) => {
    if (cur.id === userId) {
      const newCur = Object.assign(cur, userData)
      return [...acc, newCur]
    }
    return [...acc, cur]
  }, [])
  const newResponse = JSON.stringify(newData)
  writeFile(`${__dirname}/../users.json`, newResponse, { encoding: 'utf8' })
  res.json({ status: 'success', id: userId })
})

server.delete('/api/v1/users/:userId', async (req, res) => {
  const userId = Number(req.params.userId)

  const result = await readFile(`${__dirname}/../users.json`, { encoding: 'utf8' })
    .then((users) => users)
    .catch((err) => `${err.code} ${err.message}`)

  unlink(`${__dirname}/../users.json`, (err) => {
    if (err) throw err
  })
  const data = JSON.parse(result)
  const newData = data.reduce((acc, cur) => {
    if (cur.id === userId) {
      return [...acc]
    }
    return [...acc, cur]
  }, [])
  const newResponse = JSON.stringify(newData)
  writeFile(`${__dirname}/../users.json`, newResponse, { encoding: 'utf8' })
  res.json({ status: 'success', id: userId })
})

server.delete('/api/v1/users/', async (req, res) => {
  unlink(`${__dirname}/../users.json`, (err) => {
    if (err) throw err
  })
  res.end()
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial - Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
