const pickupRepos = require('../pickupRepos')

test('pickupRepos test', async () => {
  const res = await pickupRepos()
  expect(res).toContain('mick-whats/pg-mick#sample')
})
