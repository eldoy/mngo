const mongo = require('../index.js')
const { ObjectId } = require('mongodb')
let $db, action, model, data

beforeAll(async () => {
  $db = await mongo.connect()
  $db.on('change', (a, m, d) => {
    action = a
    model = m
    data = d
  })
})

beforeEach(async () => {
  for (const d of ['mngotest', 'mngo']) {
    $db.setDatabase(d)
    let projects = await $db.project.find()
    for (const p of projects) {
      await $db.project.delete({ _id: p._id })
    }
  }
})

describe('Mongo', () => {

  /**
  * MONGO
  **/

  it('should create mongodb object ids', () => {
    let id = $db.id()
    expect(id.constructor).toEqual(ObjectId)
    id = $db.id('test')
    expect(id.constructor).toEqual(ObjectId)
    const t = '5b852d75cf0aeb856bdb56ef'
    id = $db.id(t)
    expect(id.constructor).toEqual(ObjectId)
    expect(id.toString()).toEqual(t)
  })

  it('should change databases on connection', async () => {
    $db.setDatabase('mngotest')
    let project = await $db.project.insert({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')
    project = await $db.project.findOne({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')
    project = await $db.project.delete({ name: 'baner' })
    project = await $db.project.findOne({ name: 'baner' })
    expect(project).toBeNull()
    $db.setDatabase('mngo')
  })

  it('should change databases per collection', async () => {
    let project = await $db.collection('project').insert({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')
    let c = $db.collection('project', {
      db: 'mngotest'
    })
    project = await c.insert({ name: 'baner' })
    expect(project._id).toBeDefined()
    project = await c.delete({ name: 'baner' })
    expect(project._id).toBeDefined()
    project = await c.findOne({ name: 'baner' })
    expect(project).toBeNull()
  })

  it('should insert an object', async () => {
    const project = await $db.project.insert({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')
  })

  it('should insert an object', async () => {
    let project = await $db.project.insert({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')

    project = await $db.project.update(
      { _id: project._id }, { name: 'update' }
    )

    expect(project._id).toBeDefined()
    expect(project.name).toEqual('update')

    project = await $db.project.update(
      { _id: project._id }, {}
    )
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('update')
  })

  it('should delete an object', async () => {
    let project = await $db.project.insert({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')

    project = await $db.project.delete({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')
  })

  it('should find an object', async () => {
    let project = await $db.project.insert({ name: 'baner' })
    project = await $db.project.findOne({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')
  })

  it('should find objects', async () => {
    await $db.project.insert({ name: 'baner1' })
    await $db.project.insert({ name: 'baner2' })
    const projects = await $db.project.find({})
    expect(projects.length).toEqual(2)
    expect(projects[0].name).toEqual('baner1')
    expect(projects[1].name).toEqual('baner2')
  })

  it('should support insert events', async (done) => {
    let project = await $db.project.insert({ name: 'baner' })
    expect(action).toEqual('insert')
    expect(model).toEqual('project')
    expect(data.name).toEqual('baner')
    done()
  })

  it('should support update events', async (done) => {
    let project = await $db.project.insert({ name: 'baner' })
    project = await $db.project.update(
      { _id: project._id }, { name: 'update' }
    )
    expect(action).toEqual('update')
    expect(model).toEqual('project')
    expect(data.name).toEqual('update')
    done()
  })

  it('should support delete events', async (done) => {
    let project = await $db.project.insert({ name: 'baner' })
    project = await $db.project.delete({ _id: project._id })
    expect(action).toEqual('delete')
    expect(model).toEqual('project')
    expect(data.name).toEqual('baner')
    done()
  })
})
