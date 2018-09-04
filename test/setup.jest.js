const { MongoClient } = require('mongodb')
let db
const mongo = () => {
  return MongoClient.connect('mongodb://localhost:27017', {
    poolSize: 100
  })
}
mongo().then((client) => { db = client.db('mngo') })

// Clear out the db before each run
const before = (done) => {
  (async () => {
    // Drop db
    try {
      await db.dropCollection('project')
    } catch (err) {}
    done()
  })()
}

// Logging with color
const log = (obj) => {
  let err = new Error()
  let result = `${JSON.stringify(obj, null, 2)}
  * Location:${err.stack.slice(5)}`
  console.log('\x1b[36m%s\x1b[0m', result)
}

module.exports = {
  before,
  mongo,
  log
}
