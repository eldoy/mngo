const Connection = require('./lib/connection.js')
const mongo = {}

// Connect to db
mongo.connection = async (config = {}, options = {}) => {
  const connection = new Connection(config, options)
  await connection.init()
  return new Proxy(connection, {
    get: function (obj, prop) {
      if (!(prop in obj)) {
        return obj.collection(prop)
      }
      return obj[prop]
    }
  })
}

module.exports = mongo
