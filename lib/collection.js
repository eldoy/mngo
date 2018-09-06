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

  async find (where, options = {}) {
    return this.collection.find(where, options).toArray()
  }

  async get (where, options = {}) {
    return this.collection.findOne(where, options)
  }

  async insert (what, options = {}) {
    let doc = await this.collection.insertOne(what)
    doc = { ...{ _id: doc.insertedId }, ...what }
    this.connection.emit('change', 'insert', this.model, doc)
    return doc
  }

  async update (where, what, options = {}) {
    if (Object.keys(what).length > 0) {
      await this.collection.updateOne(where, { $set: what })
    }
    const doc = await this.collection.findOne(where, options)
    this.connection.emit('change', 'update', this.model, doc)
    return doc
  }

  async delete (where, options = {}) {
    const doc = await this.collection.findOne(where, options)
    await this.collection.deleteOne(where)
    this.connection.emit('change', 'delete', this.model, doc)
    return doc
  }
}

module.exports = Collection
