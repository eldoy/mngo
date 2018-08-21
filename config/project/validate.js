// Validate project
if (set.invalid === 1) {
  errors.add('invalid', 'Can not be 1')

  let data = await yql({ project: null })
  if (data.project && data.project._id) {
    errors.add('invalid', 'Must be less than 10')
  }
}
