class Pool {
  constructor () {
    this.cache = {}
  }

  database (name) {
    return this.cache[name]
  }
}

module.exports = Pool
