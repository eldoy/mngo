const { ObjectId } = require('mongodb')
const Connection = require('./lib/connection.js')
const Pool = require('./lib/pool.js')
const Events = require('events')
const DEFAULT_URL = 'mongodb://localhost:27017'
const DEFAULT_NAME = 'yql'

let database
let db
let model

const pool = new Pool()

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
mongo.connect = async function (config = {}, options = {}) {
  const connection = new Connection(config, options)
  database = await connection.init()
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
  if (Object.keys(set).length > 0) {
    await db.updateOne(get, { $set: set })
  }
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
