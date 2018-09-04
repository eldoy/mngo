const Events = require('events')
const { MongoClient, ObjectId } = require('mongodb')
const Collection = require('./collection')

const DEFAULT_URL = 'mongodb://localhost:27017'
const DEFAULT_NAME = 'yql'

class Connection extends Events {
  constructor (config, options) {
    super()
    const { url, name } = config
    this.url = url || DEFAULT_URL
    this.name = name || DEFAULT_NAME
    this.options = options
    this.pool = {}
  }

  async init () {
    this.client = await MongoClient.connect(this.url, this.options)
    this.database = this.client.db(this.name)
  }

  collection (name) {
    return new Collection(this, name)
  }

  isConnected () {
    return this.client && this.client.isConnected()
  }

  id (_id) {
    try {
      return ObjectId(_id)
    } catch (e) {
      return ObjectId()
    }
  }

  collection (name) {
    return new Collection(this, name)

    db = database.collection(name)
    return mongo
  }
}

module.exports = Connection
