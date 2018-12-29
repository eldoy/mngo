const { MongoClient } = require('mongodb')
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
    this.client = await MongoClient.connect(this.config.url, this.options)
  }

  collection (model, options = {}) {
    return new Collection(this, model, options)
  }
}

module.exports = Connection
