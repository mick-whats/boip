const _ = require('lodash')
const pickupFiles = require('../pickupFiles')

test('pickupFiles test', async () => {
  const res = await pickupFiles('mick-whats/pg-mick#sample')
  expect(res.length > 5).toBeTruthy()
  expect(_.last(res)).toMatch(
    /mick-whats\/pg-mick#sample\/src\/__tests__\/index.test.js/
  )
})
test('pickupFilestest', async () => {
  const res = await pickupFiles('hogehogeRock')
  expect(res).toEqual([])
})
