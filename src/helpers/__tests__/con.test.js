const Con = require('../con')

afterEach(() => {
  const conf = Con('injections')
  const list = conf()
  Object.keys(list).forEach(key => {
    conf(key, 'delete')
  })
})
test('con', () => {
  const conf = Con('injections')
  // set
  conf('text1', 'v1')
  // get
  expect(conf('text1')).toBe('v1')
  // set
  conf('text2', 'v2')
  // get all
  expect(conf()).toHaveProperty('text1', 'v1')
  expect(conf()).toHaveProperty('text2', 'v2')
  // delete
  conf('text1', 'delete')
  expect(conf('text1')).toBeUndefined()
  expect(conf()).not.toHaveProperty('text1')
  expect(conf()).toHaveProperty('text2', 'v2')
})
