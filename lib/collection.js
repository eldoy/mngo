class Collection {
  constructor (connection, model, options = {}) {
    this.connection = connection
    this.model = model
    this.options = options
    this.db = (options.db
      ? connection.client.db(options.db)
      : connection.database
      ).collection(model)
  }

  async find (where, options = {}) {
    return this.db.find(where, options).toArray()
  }

  async get (where, options = {}) {
    return this.db.findOne(where, options)
  }

  async insert (what, options = {}) {
    let doc = await this.db.insertOne(what)
    doc = { ...{ _id: doc.insertedId }, ...what }
    this.connection.emit('change', 'insert', this.model, doc)
    return doc
  }

  async update (where, what, options = {}) {
    if (Object.keys(what).length > 0) {
      await this.db.updateOne(where, { $set: what })
    }
    const doc = await this.db.findOne(where, options)
    this.connection.emit('change', 'update', this.model, doc)
    return doc
  }

  async delete (where, options = {}) {
    const doc = await this.db.findOne(where, options)
    await this.db.deleteOne(where)
    this.connection.emit('change', 'delete', this.model, doc)
    return doc
  }
}

module.exports = Collection
