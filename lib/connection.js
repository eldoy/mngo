const Events = require('events')
const { MongoClient, ObjectId } = require('mongodb')
const Collection = require('./collection')
const DEFAULT_CONFIG = {
  url: 'mongodb://localhost:27017',
  name: 'mngo'
}
const DEFAULT_OPTIONS = {
  poolSize: 100
}

class Connection extends Events {
  constructor (config, options) {
    super()
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  async init () {
    if (!this.isConnected) {
      this.client = await MongoClient.connect(this.config.url, this.options)
    }
    this.setDatabase(this.config.name)
  }

  setDatabase (name) {
    this.database = this.client.db(name)
  }

  collection (model, options = {}) {
    return new Collection(this, model, options)
  }

  id (_id) {
    try { return ObjectId(_id) } catch (e) { return ObjectId() }
  }

  get isConnected () {
    return this.client && this.client.isConnected()
  }
}

module.exports = Connection
