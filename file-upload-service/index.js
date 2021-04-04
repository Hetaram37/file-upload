'use strict'
const express = require('express')
const { createServer } = require('http')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

// Serving static files
app.use('/public', express.static('./public/'))

// Body parser, reading data from body into req.body
app.use(express.json({
  limit: '10kb'
}))
app.use(express.urlencoded({
  extended: true,
  limit: '10kb'
}))

mongoose.connect('mongodb://127.0.0.1:27017/learn', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(() => console.log('DB connection successful!'))
  .catch(() => console.log('Error while connecting to MongoDB'))

const server = createServer(app)

require('./routes')(app)

app.all('*', (req, res, next) => {
  res.status(404).json({
    data: null,
    status_code: 'FMS_' + 404,
    status_message: 'Path not found',
    errors: `Can't find ${req.originalUrl} on this server!`
  })
})

const port = config.port || 3000
server.listen(port, () => {
  console.log(`File Upload Mgmt running on port ${port}.`)
})

module.exports = app
