const { MongoClient, ObjectId } = require('mongodb')

const Events = require('events')
const URL = 'mongodb://localhost:27017'
const NAME = 'yql'
let client
let database
let db
let model

class EventEmitter extends Events {}
let events = new EventEmitter()

const mongo = {}

mongo.id = function (_id) {
  try {
    return ObjectId(_id)
  } catch (e) {
    return ObjectId()
  }
}

mongo.on = function (event, fn) {
  events.on(event, fn)
}

mongo.emit = function (event, data = {}) {
  events.emit(event, data)
}

// Connect to db
mongo.connect = async function (conf = {}) {
  client = await MongoClient.connect(conf.url || URL)
  database = client.db(conf.name || NAME)
  return mongo.collection
}

mongo.collection = function (name) {
  model = name
  db = database.collection(name)
  return mongo
}

mongo.find = async function (get, options = {}) {
  return db.find(get, options).toArray()
}

mongo.findOne = async function (get, options = {}) {
  return db.findOne(get, options)
}

mongo.insert = async function (set, options = {}) {
  let doc = await db.insertOne(set)
  doc = { ...{ _id: doc.insertedId }, ...set }
  events.emit('change', 'insert', model, doc)
  return doc
}

mongo.update = async function (get, set, options = {}) {
  await db.updateOne(get, { $set: set })
  const doc = await db.findOne(get, options)
  events.emit('change', 'update', model, doc)
  return doc
}

mongo.delete = async function (get, options = {}) {
  const doc = await db.findOne(get, options)
  await db.deleteOne(get)
  events.emit('change', 'delete', model, doc)
  return doc
}

module.exports = mongo
