class Collection {
  constructor (connection, model, options = {}) {
    this.connection = connection
    this.model = model
    this.options = options
    this.database = options.db || connection.config.name
    this.collection = connection.client.db(this.database).collection(model)

    // Generate event functions
    for(const fn of ['find', 'first', 'insert', 'update', 'delete']) {
      this[`$${fn}`] = async (...args) => {
        const result = await this[fn](...args)
        this.emit(fn, result)
        return result
      }
    }
  }

  // Emit change event
  emit (type, doc) {
    this.connection.mongo.emit('change', this.database, type, this.model, doc)
  }

  // Find array of documents
  async find (where, options) {
    return await this.collection.find(where, options).toArray()
  }

  // Find single document
  async first (where, options) {
    return await this.collection.findOne(where, options)
  }

  // Insert document, returns inserted object
  async insert (what, options) {
    let doc = await this.collection.insertOne(what)
    return { ...{ _id: doc.insertedId }, ...what }
  }

  // Update document, returns updated document
  async update (where, what, options) {
    if (Object.keys(what).length > 0) {
      await this.collection.updateOne(where, { $set: what })
    }
    return await this.collection.findOne(where, options)
  }

  // Delete document, returns deleted document
  async delete (where, options) {
    const doc = await this.collection.findOne(where, options)
    await this.collection.deleteOne(where)
    return doc
  }
}

module.exports = Collection
