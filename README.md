# MNGO Evented MongoDB database client
A thin layer on top of the native mongodb driver with support for events. Simplifies the API and connection handling too.

### INSTALL
```npm i mngo``` or ```yarn add mngo```

### USAGE
```javascript

const mongo = require('mngo')

const db = await mongo.connection(
  {
    url: 'mongodb://localhost:27017',
    name: 'mngo'
  },
  {
    poolSize: 100
  }
)

// Insert
await db.project.insert({ name: 'hello' })
await db.project.insert({ name: 'hello' }, {}) // Last parameter is native mongodb options

// Update
await db.project.update({ name: 'hello' }, { name: 'newname' })

// Find one
await db.project.findOne({ name: 'hello' })

// Find many
await db.project.find({ name: 'hello' })

// Object ID
db.id()          // Returns new object id
db.id(string_id) // Returns mongodb id string as object

// Change database on the same connection
db.setDatabase('name')

// Register events
db.on('change', (type, name, doc) => {
  console.log('Database changed!')
  console.log(type) // Event type is either insert, update or delete
  console.log(name) // Name of collection
  console.log(doc)  // The new document data
})
```
The connections are automatically pooled and re-used if possible. Enjoy!
