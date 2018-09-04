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

  async find (get, options = {}) {
    return this.db.find(get, options).toArray()
  }

  async findOne (get, options = {}) {
    return this.db.findOne(get, options)
  }

  async insert (set, options = {}) {
    let doc = await this.db.insertOne(set)
    doc = { ...{ _id: doc.insertedId }, ...set }
    this.connection.emit('change', 'insert', this.model, doc)
    return doc
  }

  async update (get, set, options = {}) {
    if (Object.keys(set).length > 0) {
      await this.db.updateOne(get, { $set: set })
    }
    const doc = await this.db.findOne(get, options)
    this.connection.emit('change', 'update', this.model, doc)
    return doc
  }

  async delete (get, options = {}) {
    const doc = await this.db.findOne(get, options)
    await this.db.deleteOne(get)
    this.connection.emit('change', 'delete', this.model, doc)
    return doc
  }
}

module.exports = Collection
