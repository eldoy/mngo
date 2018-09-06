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

  emit (type, doc) {
    this.connection.emit('change', type, this.model, doc)
  }

  async find (where, options = {}) {
    const docs = await this.collection.find(where, options).toArray()
    this.emit('find', docs)
    return docs
  }

  async get (where, options = {}) {
    const doc = await this.collection.findOne(where, options)
    this.emit('get', doc)
    return doc
  }

  async insert (what, options = {}) {
    let doc = await this.collection.insertOne(what)
    doc = { ...{ _id: doc.insertedId }, ...what }
    this.emit('insert', doc)
    return doc
  }

  async update (where, what, options = {}) {
    if (Object.keys(what).length > 0) {
      await this.collection.updateOne(where, { $set: what })
    }
    const doc = await this.collection.findOne(where, options)
    this.emit('update', doc)
    return doc
  }

  async delete (where, options = {}) {
    const doc = await this.collection.findOne(where, options)
    await this.collection.deleteOne(where)
    this.emit('delete', doc)
    return doc
  }
}

module.exports = Collection
