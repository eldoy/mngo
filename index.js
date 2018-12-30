const { ObjectId } = require('mongodb')
const Events = require('events')
const Connection = require('./lib/connection.js')

class Mongo extends Events {
  constructor () {
    super()
  }

  // Connect to db
  async connect (config = {}, options = {}) {
    const c = new Connection(this, config, options)
    const db = function (name, options) {
      return c.collection(name, options)
    }
    db.database = function (name) {
      c.config.name = name
    }
    db.id = function (_id) {
      try { return ObjectId(_id) } catch (e) { return ObjectId() }
    }
    db.connected = function () {
      return c.client && c.client.isConnected()
    }
    while (!db.connected()) {
      try {
        await c.init()
        db.client = c.client
      } catch (e) {
        await new Promise(resolve => {
          setTimeout(() => { resolve() }, 100)
        })
      }
    }
    return db
  }
}

module.exports = new Mongo()
