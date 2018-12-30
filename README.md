# MNGO Evented MongoDB Database Client
A thin layer on top of the native mongodb driver with support for events. Updates, inserts and deletes can be subscribed to for use with web sockets.

The client retries connection if the database server is not ready, which is perfect for container environments. You'll love Mngo if you're using docker or rkt.

Any changes returns the full document. You can change the database name for a connection or a single collection transaction on the fly which is great for multi-database environments. MIT licensed.

### INSTALL
```npm i mngo``` or ```yarn add mngo```

### USAGE
```javascript

const mongo = require('mngo')

// Returns a Connection object
const db = await mongo.connect(
  {
    url: 'mongodb://localhost:27017',
    name: 'mngo'
  },
  {
    poolSize: 100
  }
)

// Get collection
const projectCollection = db('project')

// Collection with options
const projectCollection = db('project', {
  db: 'name' // Db name only for this collection
})

// Insert
await db('project').insert({ name: 'hello' })
await db('project').insert({ name: 'hello' }, {}) // Last parameter are native mongodb options

// Update
await db('project').update({ name: 'hello' }, { name: 'newname' })

// Find first match, returns an single object or null
await db('project').first({ name: 'hello' })

// Find many returns an array
await db('project').find({ name: 'hello' })

// Delete
await db('project').delete({ name: 'hello' })

// Object ID
db.id()          // Returns new object id
db.id(string_id) // Returns mongodb id string as object

// Change database on the same connection
db.database('name')

// Check connection status
db.connected()

// Native mongodb client
db.client

// Register events
mongo.on('change', (db, type, name, data) => {
  console.log('Database changed!')
  console.log(db)   // Name of database
  console.log(type) // Type is first, find, insert, update or delete
  console.log(name) // Name of collection
  console.log(data  // The data
})

// Add '$' in front to also emit change events
await db('project').$find()
await db('project').$first()
await db('project').$insert()
await db('project').$update()
await db('project').$delete()
```
The connections are automatically pooled and re-used if possible. Enjoy!
