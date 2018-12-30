const mongo = require('../index.js')
const { ObjectId } = require('mongodb')
let $db, action, model, data

jest.setTimeout(10000)

describe('Mongo', () => {
  beforeAll(async () => {
    $db = await mongo.connect()
    mongo.on('change', (db, a, m, d) => {
      [ database, action, model, data ] = [ db, a, m, d]
    })
  })

  beforeEach(async () => {
    action, model, data = undefined
    for (const d of ['mngotest', 'mngo']) {
      $db.database(d)
      let projects = await $db('project').find()
      for (const p of projects) {
        await $db('project').delete({ _id: p._id })
      }
    }
  })

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

  it('should have access to native client', () => {
    expect($db.client).toBeDefined()
  })

  it('should change databases on connection', async () => {
    $db.database('mngotest')
    let project = await $db('project').insert({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')
    project = await $db('project').first({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')
    project = await $db('project').delete({ name: 'baner' })
    project = await $db('project').first({ name: 'baner' })
    expect(project).toBeNull()
    $db.database('mngo')
  })

  it('should change databases per collection', async () => {
    let project = await $db('project').insert({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')
    let c = $db('project', { db: 'mngotest' })
    project = await c.insert({ name: 'baner' })
    expect(project._id).toBeDefined()
    project = await c.delete({ name: 'baner' })
    expect(project._id).toBeDefined()
    project = await c.first({ name: 'baner' })
    expect(project).toBeNull()
  })

  it('should insert an object', async () => {
    const project = await $db('project').insert({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')
  })

  it('should insert an object', async () => {
    let project = await $db('project').insert({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')

    project = await $db('project').update(
      { _id: project._id }, { name: 'update' }
    )

    expect(project._id).toBeDefined()
    expect(project.name).toEqual('update')

    project = await $db('project').update(
      { _id: project._id }, {}
    )
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('update')
  })

  it('should delete an object', async () => {
    let project = await $db('project').insert({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')

    project = await $db('project').delete({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')
  })

  it('should find an object', async () => {
    let project = await $db('project').insert({ name: 'baner' })
    project = await $db('project').first({ name: 'baner' })
    expect(project._id).toBeDefined()
    expect(project.name).toEqual('baner')
  })

  it('should find objects', async () => {
    await $db('project').insert({ name: 'baner1' })
    await $db('project').insert({ name: 'baner2' })
    const projects = await $db('project').find({})
    expect(projects.length).toEqual(2)
    expect(projects[0].name).toEqual('baner1')
    expect(projects[1].name).toEqual('baner2')
  })

  it('should support insert events', async () => {
    let project = await $db('project').$insert({ name: 'baner' })
    expect(database).toEqual('mngo')
    expect(action).toEqual('insert')
    expect(model).toEqual('project')
    expect(data.name).toEqual('baner')
  })

  it('should support update events', async () => {
    let project = await $db('project').insert({ name: 'baner' })
    project = await $db('project').$update(
      { _id: project._id }, { name: 'update' }
    )
    expect(database).toEqual('mngo')
    expect(action).toEqual('update')
    expect(model).toEqual('project')
    expect(data.name).toEqual('update')
  })

  it('should support delete events', async () => {
    let project = await $db('project').insert({ name: 'baner' })
    project = await $db('project').$delete({ _id: project._id })
    expect(database).toEqual('mngo')
    expect(action).toEqual('delete')
    expect(model).toEqual('project')
    expect(data.name).toEqual('baner')
  })

  it('should support find first events', async () => {
    let project = await $db('project').insert({ name: 'baner' })
    project = await $db('project').$first({ _id: project._id })
    expect(database).toEqual('mngo')
    expect(action).toEqual('first')
    expect(model).toEqual('project')
    expect(data.name).toEqual('baner')
  })

  it('should support find events', async () => {
    let project = await $db('project').insert({ name: 'baner' })
    project = await $db('project').$find()
    expect(database).toEqual('mngo')
    expect(action).toEqual('find')
    expect(model).toEqual('project')
    expect(data[0].name).toEqual('baner')
  })
})
