if (get && get.name === 'Before delete filter') {
  await db('project').insert({ name: 'In before delete' })
}
