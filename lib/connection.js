const { MongoClient, ObjectId } = require('mongodb')
const Collection = require('./collection')
const CONFIG = {
  url: 'mongodb://localhost:27017',
  name: 'mngo'
}
const OPTIONS = {
  poolSize: 100,
  useNewUrlParser: true
}

class Connection {
  constructor (mongo, config, options) {
    this.mongo = mongo
    this.config = { ...CONFIG, ...config }
    this.options = { ...OPTIONS, ...options }
  }

  async init () {
    if (!this.isConnected) {
      this.client = await MongoClient.connect(this.config.url, this.options)
    }
  }

  setDatabase (name) {
    this.config.name = name
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
