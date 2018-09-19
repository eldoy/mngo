const Events = require('events')
const Connection = require('./lib/connection.js')

class Mongo extends Events {
  constructor () {
    super()
  }

  // Connect to db
  async connect (config = {}, options = {}) {
    const connection = new Connection(this, config, options)
    while (!connection.isConnected) {
      try {
        await connection.init()
      } catch (e) {
        await new Promise((resolve) => {
          setTimeout(() => { resolve() }, 10)
        })
      }
    }
    return new Proxy(connection, {
      get: function (obj, prop) {
        if (!(prop in obj)) {
          return obj.collection(prop)
        }
        return obj[prop]
      }
    })
  }
}

module.exports = new Mongo()
