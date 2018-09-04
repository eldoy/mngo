const { MongoClient } = require('mongodb')

const DEFAULT_URL = 'mongodb://localhost:27017'
const DEFAULT_NAME = 'yql'

class Connection {
  constructor (config, options) {
    const { url, name } = config
    this.url = url || DEFAULT_URL
    this.name = name || DEFAULT_NAME
    this.options = options
  }

  async init () {
    this.client = await MongoClient.connect(this.url, this.options)
    this.database = this.client.db(this.name)
    return this.database
  }

  isConnected () {
    return this.client && this.client.isConnected()
  }
}

module.exports = Connection
