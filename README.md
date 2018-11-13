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

// Collection, by proxy or function
const projectCollection = db.get('project')

// Collection with options
const projectCollection = db.get('project', {
  db: 'name' // Db name only for this collection
})

// Insert
await db.get('project').insert({ name: 'hello' })
await db.get('project').insert({ name: 'hello' }, {}) // Last parameter is native mongodb options

// Update
await db.get('project').update({ name: 'hello' }, { name: 'newname' })

// Find first match, returns an single object or null
await db.get('project').first({ name: 'hello' })

// Find many returns an array
await db.get('project').find({ name: 'hello' })

// Delete
await db.get('project').delete({ name: 'hello' })

// Object ID
db.id()          // Returns new object id
db.id(string_id) // Returns mongodb id string as object

// Change database on the same connection
db.setDatabase('name')

// Check connection status
db.isConnected

// Native mongodb client
db.client

// Register events
mongo.on('change', (db, type, name, doc) => {
  console.log('Database changed!')
  console.log(db)   // Name of database
  console.log(type) // Event type is either find, insert, update or delete
  console.log(name) // Name of collection
  console.log(doc)  // The new document data
})

// Add '$' in front to also emit events
await db.get('project').$find()    // Emits 'find' event
await db.get('project').$first()   // Emits 'find' event
await db.get('project').$insert()  // Emits 'insert' event
await db.get('project').$update()  // Emits 'update' event
await db.get('project').$delete()  // Emits 'delete' event
```
The connections are automatically pooled and re-used if possible. Enjoy!
