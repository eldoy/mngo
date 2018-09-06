class Collection {
  constructor (connection, model, options = {}) {
    this.connection = connection
    this.model = model
    this.options = options
    this.collection = (options.db
      ? connection.client.db(options.db)
      : connection.database
      ).collection(model)
  }

  // EVENT HELPERS

  emit (type, doc) {
    this.connection.emit('change', type, this.model, doc)
  }

  async xfind(where, options = {}) {
    return this.find(where, options, true)
  }

  async xget (where, options = {}) {
    return this.get(where, options, true)
  }

  async xinsert (what, options = {}) {
    return this.insert(what, options, true)
  }

  async xupdate (where, what, options = {}) {
    return this.update(where, what, options, true)
  }

  async xdelete (where, options = {}) {
    return this.delete(where, options, true)
  }

  // DATABASE FUNCTIONS

  async find (where, options = {}, emit = false) {
    const docs = await this.collection.find(where, options).toArray()
    if (emit) this.emit('find', docs)
    return docs
  }

  async get (where, options = {}, emit = false) {
    const doc = await this.collection.findOne(where, options)
    if (emit) this.emit('get', doc)
    return doc
  }

  async insert (what, options = {}, emit = false) {
    let doc = await this.collection.insertOne(what)
    doc = { ...{ _id: doc.insertedId }, ...what }
    if (emit) this.emit('insert', doc)
    return doc
  }

  async update (where, what, options = {}, emit = false) {
    if (Object.keys(what).length > 0) {
      await this.collection.updateOne(where, { $set: what })
    }
    const doc = await this.collection.findOne(where, options)
    if (emit) this.emit('update', doc)
    return doc
  }

  async delete (where, options = {}, emit = false) {
    const doc = await this.collection.findOne(where, options)
    await this.collection.deleteOne(where)
    if (emit) this.emit('delete', doc)
    return doc
  }
}

module.exports = Collection
